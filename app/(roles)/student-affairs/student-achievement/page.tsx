"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useStudentAchievement } from "@/app/hooks/useStudentAchievement";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";

export default function StudentAffairsAchievementPage() {

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { studentAchievement, loading, error, fetchStudentAchievement } = useStudentAchievement();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                setIsAuthorized(true);
                await fetchStudentAchievement();   
                const id = getUserIdFromToken();
                if (id) {
                    setUserId(id);
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Search item tabel
    const filteredData = studentAchievement.filter(item =>
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.achievementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.typeOfAchievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.achievementDate.includes(searchTerm)
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Prestasi Siswa</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>


                {/* Filtering Bulanan */}
                <div className="mt-4 sm:mt-0">
                    <div className=" bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                        <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 focus:outline-none text-base w-40"
                        />
                    </div>
                </div>
            </header>

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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

                        {/* 3 button*/}

                        <div className="flex space-x-2 mt-5 sm:mt-0">
                            {/* Button Tambah Data */}
                            <button
                                onClick={() => console.log("Tambah Data")}
                                className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                            >
                                Tambah Data
                            </button>

                            {/* Button Import CSV */}
                            <button
                                onClick={() => console.log("Import CSV")}
                                className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                            >
                                Import Dari Excel
                            </button>

                            {/* Dropdown Export */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="bg-[var(--third-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#09859a] flex items-center"
                                >
                                    Export Data
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className={`w-4 h-4 ml-2 transform transition-transform ${dropdownOpen ? 'rotate-90' : 'rotate-0'
                                            }`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => console.log("Export PDF")}
                                            className="block w-full text-left text-[var(--text-regular-color)] px-4 py-2 hover:bg-gray-100"
                                        >
                                            Export PDF
                                        </button>
                                        <button
                                            onClick={() => console.log("Export Excel")}
                                            className="block w-full text-left text-[var(--text-regular-color)] px-4 py-2 hover:bg-gray-100"
                                        >
                                            Export Excel
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>


                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Prestasi</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Bukti Foto</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.id}</td>
                                        <td className="py-2 px-4 border-b">{item.student.name}</td>
                                        <td className="py-2 px-4 border-b">{item.class.name}</td>
                                        <td className="py-2 px-4 border-b">{item.achievementName}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.typeOfAchievement === 'Non_Academic' ? 'bg-[#0a97b028] text-[var(--third-color)]' : item.typeOfAchievement === 'academic' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : ''}`}>
                                                {item.typeOfAchievement}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {item.photo ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/achievement/${item.photo.split('/').pop()}`}
                                                        alt="Bukti Surat"
                                                        className="w-full h-full object-cover"
                                                        width={256}
                                                        height={256}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">{formatDate(item.achievementDate)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"

                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"

                                                >
                                                    <i className="bx bxs-trash-alt text-lg"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                        <span className="text-xs sm:text-base">Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                                    const pageNumber = currentPage + index;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`rounded-md px-3 py-1 ${currentPage === pageNumber ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'}`}
                                        >
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
                </div>
            </main>
        </div>
    );
}
