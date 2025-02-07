"use client";

import "@/app/styles/globals.css";
import { useState, useRef, useEffect, useMemo } from 'react';
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import React from 'react';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import { useDashboardFacilities } from "@/app/hooks/useDashboardFacilities";
import { authApi } from "@/app/api/auth";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { usePositions } from "@/app/hooks/usePositionData";
import { useStudents } from "@/app/hooks/useStudent";
import { useTeachers } from "@/app/hooks/useTeacher";
import { useMajors } from "@/app/hooks/useMajorData";
import { useEmployee } from "@/app/hooks/useEmployee";
import { useSubjects } from "@/app/hooks/useSubject";
import { useUser } from "@/app/hooks/useUser";

interface User {
    id: number;
    name: string;
    username: string;
}

interface CircleProgressBarProps {
    percentage: number;
    label: string;
    color: string;
    backgroundColor: string; // Menambahkan backgroundColor
}

export default function FacilitiesDashboardPage() {
    const { positions,
        loading,
        error,
        fetchPositions, } = usePositions();

    const { students, fetchStudents, } = useStudents();

    const { teachers, fetchTeachers } = useTeachers();

    const { employee, fetchEmployee } = useEmployee();

    const { majors, fetchMajors } = useMajors()

    const { subjects, fetchSubjects } = useSubjects();

    const { user } = useUser();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                fetchPositions()

                const userId = getUserIdFromToken();
                if (userId) {
                    fetchUserData(Number(userId));
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
        fetchEmployee();
        fetchMajors();
        fetchSubjects();
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

    const [isAuthorized, setIsAuthorized] = useState(false);
    const token = Cookies.get("token");
    const [userId, setUserId] = useState<User>({
        id: 0,
        name: '',
        username: '',
    });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = positions.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt.includes(searchTerm)
    );

    // Memproses data absensi
    const cardData = useMemo(() => {
        return {
            student: students.length,
            teacher: teachers.length,
            employee: employee.length,
            major: majors.length
        };
    }, [students, teachers, employee, majors]);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
                    <p className="text-sm text-gray-600">
                        Halo {user?.username || 'User'}, selamat datang kembali
                    </p>
                </div>
            </header>
            {/* End Header */}

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">
                {/* Start 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center  ">
                            <i className='bx bxs-user text-[#1f509a] text-4xl'></i> {/* Ikon untuk Jumlah Siswa */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{cardData.student}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Jumlah Siswa</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-chalkboard text-[#e88d1f] text-4xl'></i> {/* Ikon untuk Jumlah Guru */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{cardData.teacher}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Jumlah Guru</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-briefcase text-[#0a97b0] text-3xl'></i> {/* Ikon untuk Jumlah Karyawan */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{cardData.employee}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Jumlah Karyawan</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-graduation text-[#bd0000] text-4xl'></i> {/* Ikon untuk Jumlah Jurusan */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{cardData.major}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Jumlah Jurusan</p>
                        </div>
                    </div>
                </div>
                {/* End 4 Cards */}

                {/* Start Card for Mapel */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4">Mata Pelajaran</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <div key={index} className="bg-[#f0f4ff] shadow-md rounded-lg p-4 flex items-center justify-between transition-transform transform hover:scale-105">
                                    <p className="text-lg text-[var(--text-regular-color)]">{subject.name}</p>
                                    <i className={`bx bxs-book text-[#1f509a] text-3xl`}></i> {/* Sesuaikan ikon jika tersedia di backend */}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-4">Tidak ada data mata pelajaran</p>
                        )}
                    </div>
                </div>
                {/* End Card for Mapel */}


                {/* Card for Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="mb-4 flex justify-between ">
                        {/* Start Showing entries */}
                        <div className="">
                            <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]"> Data Posisi Jabatan </span>
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
                                    <th className="py-2 px-4 border-b text-left">Posisi Jabatan</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Posisi Jabatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-1 px-2 border-b">{index + 1}</td>
                                        <td className="py-1 px-2 border-b">{item.position}</td>
                                        <td className="py-1 px-2 border-b">{item.name}</td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-500 py-4">Belum ada data Posisi Jabatan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* End Table */}
                </div>
            </div>
        </main>
    );
}