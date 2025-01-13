"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import IncomingModal from "@/app/components/IncomingModal.js";

type Incoming = {
    no: number;
    name: string;
    stock: number;
    condition: string;
    quantity: number;

};

export default function IncomingGoodsPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["Facilities"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncoming, setSelectedIncoming] = useState<Incoming | null>(null);

    const data = [
        { no: 1, name: "Papan Tulis", stock: 200, condition: "Baik", quantity: 5 },
        { no: 2, name: "Proyektor", stock: 40, condition: "Baik", quantity: 2 },
        { no: 3, name: "Meja Guru", stock: 50, condition: "Baik", quantity: 10 },
        { no: 4, name: "Printer", stock: 20, condition: "Baik", quantity: 3 },
        { no: 5, name: "Lemari Besi", stock: 26, condition: "Baik", quantity: 5 },
        { no: 6, name: "Kursi Lipat", stock: 150, condition: "Baik", quantity: 30 },
        { no: 7, name: "Laptop", stock: 30, condition: "Baik", quantity: 5 },
        { no: 8, name: "Whiteboard Marker", stock: 500, condition: "Baik", quantity: 50 },
        { no: 9, name: "Kabel HDMI", stock: 100, condition: "Baik", quantity: 20 },
        { no: 10, name: "Speaker", stock: 25, condition: "Baik", quantity: 5 },
        { no: 11, name: "Mikrofon", stock: 15, condition: "Baik", quantity: 3 },
        { no: 12, name: "AC", stock: 10, condition: "Baik", quantity: 2 },
        { no: 13, name: "Kipas Angin", stock: 50, condition: "Baik", quantity: 10 },
        { no: 14, name: "Meja Lipat", stock: 60, condition: "Baik", quantity: 15 },
        { no: 15, name: "Kursi Kantor", stock: 40, condition: "Baik", quantity: 8 },
        { no: 16, name: "Scanner", stock: 12, condition: "Baik", quantity: 2 },
        { no: 17, name: "Televisi", stock: 8, condition: "Baik", quantity: 1 },
        { no: 18, name: "Kamera CCTV", stock: 20, condition: "Baik", quantity: 4 },
        { no: 19, name: "Lampu LED", stock: 200, condition: "Baik", quantity: 50 },
        { no: 20, name: "Alat Tulis", stock: 1000, condition: "Baik", quantity: 200 },
    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        setSelectedIncoming(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (incoming: Incoming) => {
        setSelectedIncoming(incoming);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Incoming) => {
        if (selectedIncoming) {
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
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Barang Masuk</h1>
                    <p className="text-sm text-gray-600">Halo Admin Sarpras, selamat datang kembali</p>
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
                                    <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                                    <th className="py-2 px-4 border-b text-left">Kondisi</th>
                                    <th className="py-2 px-4 border-b text-left">Stok</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.condition}</td>
                                        <td className="py-2 px-4 border-b">{item.stock}</td>
                                        <td className="py-2 px-4 border-b">{item.quantity}</td>
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
            <IncomingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                incomingData={selectedIncoming}
            />
        </div>
    );
}
