"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';


export default function StudentAffairsAbsencePage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["StudentAffairs"]);
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const data = [
        { no: 1, name: "Ilham Kurniawan", class: "X PH A", status: "Hadir", document: null, date: "21/01/2024" },
        { no: 2, name: "Adi Kurniawan", class: "X PH B", status: "Izin", document: "/images/Berita1.jpg", date: "22/01/2024" },
        { no: 3, name: "Imam Kurniawan", class: "XI IPA A", status: "Sakit", document: "/images/Berita1.jpg", date: "23/01/2024" },
        { no: 4, name: "Fawas Kurniawan", class: "XI IPA B", status: "Alpha", document: null, date: "24/01/2024" },
        { no: 5, name: "Obing Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 6, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 7, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 8, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 9, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 10, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 11, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 12, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 13, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 14, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 15, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 16, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 17, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 18, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 19, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 20, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },

    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Absensi Siswa</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>


                {/* Filtering Bulanan */}
                <div className="relative mt-4 sm:mt-0 w-full sm:w-72 ">
                    <div className=" bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56">
                        <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
                        />
                    </div>
                </div>
            </header>

            <main className="px-6 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="mb-4 flex justify-between">
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

                        {/* <div className=" bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56">
                            <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
                            <input
                                type="text"
                                placeholder="Cari data..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
                            />
                        </div> */}

                    </div>

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
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.class}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.status === 'Hadir' ? 'bg-[#0a97b028] text-[var(--third-color)]' : item.status === 'Sakit' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : item.status === 'Alpha' ? 'bg-[#bd000025] text-[var(--fourth-color)]' : item.status === 'Izin' ? 'bg-[#1f509a26] text-[var(--main-color)] ' : ''}`}>
                                                {item.status}
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
