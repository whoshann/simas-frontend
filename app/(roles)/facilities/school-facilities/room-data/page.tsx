"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import RoomModal from "@/app/components/RoomModal.js";

type Room = {
    no: number;
    name: string;
    type: string;
    capacity: number;
    status: string;
};


export default function RoomDataPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["Facilities"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const data = [
        { no: 1, name: "Lab RPL 1", type: "Lab", capacity: 32, status: "Tersedia", location: "Lantai 1" },
        { no: 2, name: "Lab TK 1", type: "Lab", capacity: 28, status: "Tersedia", location: "Lantai 2" },
        { no: 3, name: "Ruang Teori 27J", type: "Ruang Teori", capacity: 40, status: "Tersedia", location: "Lantai 3" },
        { no: 4, name: "Ruang Teori 14K", type: "Ruang Teori", capacity: 35, status: "Tersedia", location: "Lantai 4" },
        { no: 5, name: "Lab Jaringan 1", type: "Lab", capacity: 30, status: "Tersedia", location: "Lantai 5" },
        { no: 6, name: "Ruang Multimedia 2", type: "Ruang Teori", capacity: 25, status: "Tersedia", location: "Lantai 6" },
        { no: 7, name: "Lab Pemrograman 1", type: "Lab", capacity: 32, status: "Tersedia", location: "Lantai 7" },
        { no: 8, name: "Ruang Diskusi A", type: "Ruang Teori", capacity: 20, status: "Tersedia", location: "Lantai 8" },
        { no: 9, name: "Lab Komputer Grafis", type: "Lab", capacity: 18, status: "Tersedia", location: "Lantai 9" },
        { no: 10, name: "Ruang Olahraga", type: "Ruang Teori", capacity: 50, status: "Tersedia", location: "Lantai 10" },
        { no: 11, name: "Ruang Seni 1", type: "Ruang Teori", capacity: 15, status: "Tersedia", location: "Lantai 11" },
        { no: 12, name: "Ruang Musik B", type: "Ruang Teori", capacity: 25, status: "Tersedia", location: "Lantai 12" },
        { no: 13, name: "Lab Elektronika", type: "Lab", capacity: 24, status: "Tersedia", location: "Lantai 13" },
        { no: 14, name: "Lab RPL 2", type: "Lab", capacity: 32, status: "Tersedia", location: "Lantai 14" },
        { no: 15, name: "Ruang Teori 12B", type: "Ruang Teori", capacity: 40, status: "Tersedia", location: "Lantai 15" },
        { no: 16, name: "Ruang Teknologi A", type: "Ruang Teori", capacity: 35, status: "Tersedia", location: "Lantai 16" },
        { no: 17, name: "Lab TK 2", type: "Lab", capacity: 28, status: "Tersedia", location: "Lantai 17" },
        { no: 18, name: "Ruang Kelas 18", type: "Ruang Teori", capacity: 32, status: "Tersedia", location: "Lantai 18" },
        { no: 19, name: "Lab Produksi Grafika", type: "Lab", capacity: 20, status: "Tersedia", location: "Lantai 19" },
        { no: 20, name: "Ruang Teori 27K", type: "Ruang Teori", capacity: 45, status: "Tersedia", location: "Lantai 20" },
    ];
    

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
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
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Room) => {
        if (selectedRoom) {
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
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Fasilitas</h1>
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
                                    <th className="py-2 px-4 border-b text-left">Nama Ruang</th>
                                    <th className="py-2 px-4 border-b text-left">Tipe</th>
                                    <th className="py-2 px-4 border-b text-left">Kapasitas</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.type}</td>
                                        <td className="py-2 px-4 border-b">{item.capacity}</td>
                                        <td className="py-2 px-4 border-b">{item.status}</td>
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
            <RoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                roomData={selectedRoom}
            />
        </div>
    );
}
