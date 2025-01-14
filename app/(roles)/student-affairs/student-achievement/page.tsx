"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';


export default function StudentAffairsAchievementPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["StudentAffairs"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const data = [
        { no: 1, name: "Ilham Kurniawan", classSchool: "X PH A", achievement: "Juara 1 Taekwondo", category: "Non Akademik", document: "/images/Berita1.jpg", date: "21/01/2024" },
        { no: 2, name: "Adi Kurniawan", classSchool: "X PH B", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "22/01/2024" },
        { no: 3, name: "Imam Kurniawan", classSchool: "XI IPA A", achievement: "Juara 1 Menangkap Belut", category: "Non Akademik", document: "/images/Berita1.jpg", date: "23/01/2024" },
        { no: 4, name: "Fawas Kurniawan", classSchool: "XI IPA B", achievement: "Juara 1 Olimpiade IPA", category: "Akademik", document: "/images/Berita1.jpg", date: "24/01/2024" },
        { no: 5, name: "Obing Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 6, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Balap Karung", category: "Non Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 7, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 8, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 9, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 10, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 11, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 12, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 13, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 14, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 15, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 16, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 17, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 18, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 19, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },
        { no: 20, name: "Ilham Kurniawan", classSchool: "XII IPS A", achievement: "Juara 1 Olimpiade Sains", category: "Akademik", document: "/images/Berita1.jpg", date: "25/01/2024" },

    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.classSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
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
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.classSchool}</td>
                                        <td className="py-2 px-4 border-b">{item.achievement}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.category === 'Non Akademik' ? 'bg-[#0a97b028] text-[var(--third-color)]' : item.category === 'Akademik' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : ''}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {item.document ? (
                                                    <Image
                                                        src={item.document}
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
                                        <td className="py-2 px-4 border-b">{item.date}</td>
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
