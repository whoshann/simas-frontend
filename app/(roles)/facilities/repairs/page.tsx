"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import RepairsModal from "@/app/components/RepairsModal.js";

type Repairs = {
    no: number;
    category: string;
    name: string;
    date: string;
    cost: string;
    status: string;
};




export default function RepairsPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'Facilities'
        roleMiddleware(["Facilities"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRepairs, setSelectedRepairs] = useState<Repairs | null>(null);

    const data = [
        { no: 1, category: "Ruang", name: "Ruang Teori 27", date: "15/12/2024", cost: "1.200.000", status: "Belum Diproses" },
        { no: 2, category: "Barang", name: "AC", date: "15/12/2024", cost: "200.000", status: "Sedang Proses" },
        { no: 3, category: "Ruang", name: "Ruang Teori 5", date: "15/12/2024", cost: "800.000", status: "Sedang Proses" },
        { no: 4, category: "Barang", name: "Proyektor", date: "15/12/2024", cost: "80.000", status: "Telah Selesai" },
        { no: 5, category: "Barang", name: "Papan Tulis", date: "15/12/2024", cost: "150.000", status: "Telah Selesai" },
    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const handleAddClick = () => {
        setSelectedRepairs(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (repairs: Repairs) => {
        setSelectedRepairs(repairs);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Repairs) => {
        if (selectedRepairs) {
            // Update data
            console.log("Edit Data", data);
        } else {
            // Tambah data baru
            console.log("Tambah Data", data);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Perbaikan</h1>
                    <p className="text-sm text-gray-600">Halo role sarpras, selamat datang kembali</p>
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
                                onClick={handleAddClick}
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
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Biaya Perbaikan</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.category}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.date}</td>
                                        <td className="py-2 px-4 border-b">{item.cost}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.status === "Belum Diproses" ? 'bg-red-100 text-red-600' : item.status === "Sedang Proses" ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleEditClick(item)}
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
            <RepairsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                repairsData={selectedRepairs}
            />
        </div>
    );
}
