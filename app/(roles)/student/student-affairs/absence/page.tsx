"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { useEffect } from "react";
import { useMemo } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { getTokenData, getUserIdFromToken } from '@/app/utils/tokenHelper';
import { authApi } from '@/app/api/auth';
import { useAbsence } from "@/app/hooks/useAbsence";
import axios from "axios";
import { Student } from "@/app/api/student/types";
import { AbsenceStatus } from "@/app/utils/enums";
import { getAbsenceStatusLabel } from "@/app/utils/enumHelpers";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    sub: number;
}

interface StudentState {
    role?: string;
    name?: string;
    [key: string]: any;
}

interface User {
    id: number;
    name: string;
    username: string;
}

export interface Absence {
    id: number;
    studentId: number;
    date: string;
    status: AbsenceStatus;
    note: string | null;
    latitude: number | null;
    longitude: number | null;
    photo: string | null;
    Student: Student;
}

export default function StudentAbsencePage() {
    const [absence, setAbsence] = useState<Absence[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    const fetchAbsence = async (studentId: number) => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/absence/student/${studentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                setAbsence(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
            toast.error('Gagal mengambil data prestasi');
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student", "SuperAdmin"]);
                setIsAuthorized(true);

                const token = Cookies.get("token");
                if (token) {
                    try {
                        const decodedToken = jwtDecode<CustomJwtPayload>(token);
                        const studentId = decodedToken.sub;
                        setStudentId(studentId);

                        const response = await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/student/${studentId}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        const student = response.data.data;
                        setStudentData(student);

                        await fetchAbsence(studentId);

                        setFormData(prev => ({
                            ...prev,
                            studentId: studentId,
                            classId: student.classId
                        }));

                    } catch (error) {
                        console.error("Error fetching student data:", error);
                        toast.error("Gagal mendapatkan data siswa");
                    }
                }
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const fetchUserData = async (userId: number) => {
        try {
            const response = await authApi.getUserLogin(userId);
            setUser(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        // Ketika modal dibuka, disable scroll pada body
        document.body.style.overflow = 'hidden';
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
        // Ketika modal ditutup, enable kembali scroll pada body
        document.body.style.overflow = 'unset';
    };

    const months = [
        'Semua', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // const [error, setError] = useState<string>("");
    // const [loading, setLoading] = useState<boolean>(true);
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [studentData, setStudentData] = useState<Student | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ studentId?: number; classId?: number }>({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        username: '',
    });


    // Pindahkan fungsi filterDataByMonth ke sini
    const filterDataByMonth = (date: string) => {
        if (!date) return false;
        if (selectedMonth === 'Semua') return true; // Tampilkan semua data jika 'Semua' dipilih

        const itemDate = new Date(date);
        return itemDate.getMonth() === months.indexOf(selectedMonth) - 1 && // Kurangi 1 karena ada 'Semua' di index 0
            itemDate.getFullYear() === selectedYear;
    };

    // Filter data
    const filteredAbsence = absence
        .filter(item => filterDataByMonth(item.date))
        .filter(item => item.status.toLowerCase().includes(searchTerm.toLowerCase()));

    // Search item tabel
    const filteredData = absence.filter(item =>
        item.Student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Student.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredAbsence.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredAbsence.slice(startIndex, startIndex + entriesPerPage);



    // Memproses data absensi
    const absenceStats = useMemo(() => {
        const filteredAbsence = absence.filter(item => filterDataByMonth(item.date));
        return {
            present: filteredAbsence.filter(item => item.status === 'Present').length,
            sick: filteredAbsence.filter(item => item.status === 'Sick').length,
            alpha: filteredAbsence.filter(item => item.status === 'Alpha').length,
            permission: filteredAbsence.filter(item => item.status === 'Permission').length
        };
    }, [absence, selectedMonth, selectedYear]);


    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">


            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Absensi Anda</h1>
                    <p className="text-sm text-gray-600">Halo {studentData?.name} selamat datang kembali</p>
                </div>


                {/* Filtering Bulanan */}
                <div className="relative mt-4 sm:mt-0 w-full sm:w-72 ">
                    <div className="bg-white shadow-md rounded-lg py-4 px-7 flex items-center justify-center cursor-pointer" onClick={togglePanel}>
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-calendar text-[#1f509a] text-3xl'></i>
                        </div>
                        <div className="flex-1" >
                            <span className="text-lg font-semibold text-[var(--text-semi-bold-color)] ">Filter Bulan</span>
                            <p className="text-sm text-gray-600">{selectedMonth} {selectedYear}</p>
                        </div>
                        <svg className={`ml-7 h-4 w-4 transform transition-transform ${isPanelOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    {isPanelOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                            {months.map((month) => (
                                <div
                                    key={month}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setSelectedMonth(month);
                                        setIsPanelOpen(false);
                                    }}
                                >
                                    {month} {selectedYear}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            {/* End Header */}



            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">



                {/* Start 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center  ">
                            <i className='bx bxs-check-circle text-[#1f509a] text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.present}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Hadir</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-envelope text-[#e88d1f]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.permission}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Izin</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-clinic text-[#0a97b0]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.sick}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Sakit</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-x-circle text-[#bd0000]  text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.alpha}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Alpha</p>
                        </div>
                    </div>
                </div>
                {/* End Cards */}



                {/* Card for Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="mb-4 flex justify-between">

                        {/* Start Showing entries */}
                        <div className="text-xs sm:text-base">
                            <label className="mr-2">Tampilkan</label>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <label className="ml-2">Entri</label>
                        </div>
                        {/* End Showing entries */}


                        {/*Start Search */}
                        <div className="border border-gray-300 rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56" >
                            <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
                            <input
                                type="text"
                                placeholder="Cari data..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
                            />
                        </div>
                        {/*End Search */}
                    </div>


                    {/* Start Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Keterangan</th>
                                    <th className="py-2 px-4 border-b text-left">Bukti Surat</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((absence, index) => (
                                    <tr key={absence.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{absence.Student.name}</td>
                                        <td className="py-2 px-4 border-b">{absence.Student.class.name}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${absence.status === 'Present' ? 'bg-[#0a97b028] text-[var(--third-color)]' : absence.status === 'Sick' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : absence.status === 'Alpha' ? 'bg-[#bd000025] text-[var(--fourth-color)]' : absence.status === 'Permission' ? 'bg-[#1f509a26] text-[var(--main-color)] ' : ''}`}>
                                                {getAbsenceStatusLabel(absence.status)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {absence.photo ? (
                                                <div
                                                    className="w-16 h-16 overflow-hidden rounded cursor-pointer"
                                                    onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_API_URL}/uploads/absence/${absence.photo?.split('/').pop()}`)}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/absence/${absence.photo.split('/').pop()}`}
                                                        alt="Bukti Surat"
                                                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                                        width={256}
                                                        height={256}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">{formatDate(absence.date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* End Table */}



                    {/*Start Pagination and showing entries */}
                    <div className="flex justify-between items-center mt-5">
                        <span className="text-xs sm:text-base" >Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

                        {/* Pagination */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            {/* Pagination Numbers */}
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                                    const pageNumber = currentPage + index;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={` rounded-md px-3 py-1 ${currentPage === pageNumber ? ' bg-[var(--main-color)] text-white ' : 'text-[var(--main-color)]'}`}>
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                    {/*End Pagination and showing entries */}

                    {/* Image Modal */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
                            onClick={handleCloseImage}
                        >
                            <div className="min-h-screen px-4 py-6 flex items-center justify-center">
                                <div
                                    className="relative max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header dengan tombol close */}
                                    <div className="absolute top-0 right-0 p-4 z-10">
                                        <button
                                            onClick={handleCloseImage}
                                            className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                                        >
                                            <i className="bx bx-x text-2xl"></i>
                                        </button>
                                    </div>

                                    {/* Image container dengan scroll */}
                                    <div className="max-h-[85vh] overflow-y-auto">
                                        <Image
                                            src={selectedImage}
                                            alt="Bukti Surat"
                                            className="w-full h-auto object-contain"
                                            width={1024}
                                            height={1024}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}