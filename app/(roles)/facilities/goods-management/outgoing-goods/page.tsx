"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import OutgoingModal from "@/app/components/OutgoingModal.js";

type Outgoing = {
    no: number;
    borrower: string;
    name: string;
    returnDate: string;
    loanDate: string;
    quantity: number;
    reason: string;
    guarantee: string;
};


export default function OutgoingDataPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["Facilities"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOutgoing, setSelectedOutgoing] = useState<Outgoing | null>(null);

    const data = [
        { no: 1, borrower: "Revina Okta Safitri", returnDate: "15/12/2024", loanDate: "01/12/2024", quantity: 2, reason: "Kebutuhan GKP", guarantee: "KTP", name: "Kursi" },
        { no: 2, borrower: "Aurizta Widya Ulima", returnDate: "15/12/2024", loanDate: "01/12/2024", quantity: 1, reason: "Kebutuhan GKP", guarantee: "KTP", name: "Kabel Olor" },
        { no: 3, borrower: "Ikfi Dwi Nazila Putri", returnDate: "15/12/2024", loanDate: "01/12/2024", quantity: 10, reason: "MPLS", guarantee: "Kartu Pelajar", name: "Meja" },
        { no: 4, borrower: "Ilham Dwi Sasinka", returnDate: "15/12/2024", loanDate: "01/12/2024", quantity: 1, reason: "Kebutuhan Sosialisasi", guarantee: "KTP", name: "Kabel HDMI" },
        { no: 5, borrower: "Burhan Abdi Budono", returnDate: "15/12/2024", loanDate: "01/12/2024", quantity: 2, reason: "Kebutuhan GKP", guarantee: "KTP", name: "Meja Siswa" },
        { no: 6, borrower: "Dewi Lestari", returnDate: "16/12/2024", loanDate: "01/12/2024", quantity: 3, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 6" },
        { no: 7, borrower: "Budi Santoso", returnDate: "17/12/2024", loanDate: "01/12/2024", quantity: 4, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 7" },
        { no: 8, borrower: "Siti Aminah", returnDate: "18/12/2024", loanDate: "01/12/2024", quantity: 5, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 8" },
        { no: 9, borrower: "Agus Salim", returnDate: "19/12/2024", loanDate: "01/12/2024", quantity: 6, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 9" },
        { no: 10, borrower: "Rina Wulandari", returnDate: "20/12/2024", loanDate: "01/12/2024", quantity: 7, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 10" },
        { no: 11, borrower: "Tono Prasetyo", returnDate: "21/12/2024", loanDate: "01/12/2024", quantity: 8, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 11" },
        { no: 12, borrower: "Lina Kusuma", returnDate: "22/12/2024", loanDate: "01/12/2024", quantity: 9, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 12" },
        { no: 13, borrower: "Andi Wijaya", returnDate: "23/12/2024", loanDate: "01/12/2024", quantity: 10, reason: "Kebutuhan Kuliah", guarantee: "KTP", name: "Barang 13" }, 
    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.returnDate && item.returnDate.includes(searchTerm)) ||
        (item.loanDate && item.loanDate.includes(searchTerm))
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
        setSelectedOutgoing(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (outgoing: Outgoing) => {
        setSelectedOutgoing(outgoing);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Outgoing) => {
        if (selectedOutgoing) {
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
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Barang Keluar</h1>
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
                                    <th className="py-2 px-4 border-b text-left">Nama Peminjam</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Jaminan</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Pengembalian</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Peminjaman</th>
                                    <th className="py-2 px-4 border-b text-left">Alasan</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.borrower}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                                        <td className="py-2 px-4 border-b">{item.guarantee}</td>
                                        <td className="py-2 px-4 border-b">{item.returnDate}</td>
                                        <td className="py-2 px-4 border-b">{item.loanDate}</td>
                                        <td className="py-2 px-4 border-b">{item.reason}</td>
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
            <OutgoingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                outgoingData={selectedOutgoing}
            />
        </div>
    );
}
