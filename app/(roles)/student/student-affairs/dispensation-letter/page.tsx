"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { DispenseStatus } from '@/app/utils/enums';
import { getTokenData } from '@/app/utils/tokenHelper';
import { authApi } from '@/app/api/auth';
import Cookies from "js-cookie";
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";

interface StudentState {
    role?: string;
    name?: string;
    [key: string]: any;
}

// Data statis untuk tabel
export default function StudentDispensePage() {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [student, setStudent] = useState<any>({});
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [dispenses, setDispenses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        reason: '',
        startTime: '',
        endTime: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student", "SuperAdmin"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();

        const tokenData = getTokenData();
        if (tokenData) {
            fetchStudentData(tokenData.id);
            setStudent((prev: StudentState) => ({
                ...prev,
                role: tokenData.role
            }));
        }
    }, []);

    useEffect(() => {
        if (student.id) {
            fetchDispenses();
        }
    }, [student.id]);

    const fetchStudentData = async (userId: number) => {
        try {
            const response = await authApi.getStudentLogin(userId);
            setStudent((prev: StudentState) => ({
                ...prev,
                ...response.data
            }));
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data");
        }
    };

    const fetchDispenses = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/dispense`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        studentId: student.id
                    }
                }
            );

            const studentDispenses = response.data.data.filter(
                (dispense: any) => dispense.studentId === student.id
            );
            setDispenses(studentDispenses);
        } catch (error) {
            console.error('Error fetching dispenses:', error);
            await showErrorAlert('Error', 'Gagal mengambil data dispensasi');
        }
    };

    // Handler untuk perubahan input form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler untuk submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!student.id) {
            await showErrorAlert('Error', 'Data siswa tidak ditemukan');
            return;
        }

        try {
            // Format waktu ke HH:mm
            const formatTime = (time: string) => {
                return time.split(':').slice(0, 2).join(':');
            };

            const dispenseData = {
                studentId: student.id,
                reason: formData.reason,
                startTime: formatTime(formData.startTime),
                endTime: formatTime(formData.endTime),
                date: formData.date
            };

            const token = Cookies.get("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/dispense`,
                dispenseData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.data) {
                await showSuccessAlert('Berhasil', 'Dispensasi berhasil diajukan!');

                // Reset form
                setFormData({
                    reason: '',
                    startTime: '',
                    endTime: '',
                    date: new Date().toISOString().split('T')[0]
                });
                await fetchDispenses();
            }
        } catch (error) {
            console.error('Error submitting dispense:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message;
                if (Array.isArray(errorMessage)) {
                    // Gabungkan semua pesan error menjadi satu string
                    const errorString = errorMessage.join('\n');
                    await showErrorAlert('Error', errorString);
                } else {
                    await showErrorAlert('Error', 'Gagal mengajukan dispensasi. Silakan coba lagi.');
                }
            }
        }
    };

    // Perhitungan untuk pagination
    const filteredData = dispenses.filter(item =>
        item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student?.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Surat Dispen</h1>
                <p className="text-sm text-gray-600">Halo {student.name}, selamat datang di halaman Surat Dispen</p>
            </header>

            <main className="px-9 pb-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
                            <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
                            <span className="ml-2">Form Pengajuan Dispen</span>
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Masukkan Alasan Dispen
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-none"
                                    rows={3}
                                    required
                                    placeholder='Ingin mengikuti lomba pencak silat'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="startTime"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Jam Keluar
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endTime"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Jam Kembali
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Tanggal
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>

                    {/* Tabel Section */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {/* Table Actions */}
                        <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
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

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">No</th>
                                        <th className="py-2 px-4 border-b text-left">Nama</th>
                                        <th className="py-2 px-4 border-b text-left">Kelas</th>
                                        <th className="py-2 px-4 border-b text-left">Alasan</th>
                                        <th className="py-2 px-4 border-b text-left">Jam Keluar</th>
                                        <th className="py-2 px-4 border-b text-left">Jam Kembali</th>
                                        <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                        <th className="py-2 px-4 border-b text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                            <td className="py-2 px-4 border-b">{item.student?.name || '-'}</td>
                                            <td className="py-2 px-4 border-b">{item.student?.class?.name || '-'}</td>
                                            <td className="py-2 px-4 border-b">{item.reason}</td>
                                            <td className="py-2 px-4 border-b">
                                                {new Date(item.startTime).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {new Date(item.endTime).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {new Date(item.date).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <span className={`inline-block px-3 py-1 rounded-full ${item.status === 'Pending'
                                                    ? 'bg-[#e88e1f29] text-[var(--second-color)]'
                                                    : item.status === 'Approved'
                                                        ? 'bg-[#0a97b028] text-[var(--third-color)]'
                                                        : 'bg-[#bd000025] text-[var(--fourth-color)]'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-5">
                            <span className="text-xs sm:text-sm">
                                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
                            </span>

                            <div className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-[var(--main-color)]"
                                >
                                    &lt;
                                </button>
                                <div className="flex space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`rounded-md px-3 py-1 ${currentPage === page
                                                ? 'bg-[var(--main-color)] text-white'
                                                : 'text-[var(--main-color)]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
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
                    </div>
                </div>
            </main>
        </div>
    );
}
