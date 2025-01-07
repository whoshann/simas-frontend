"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function StudentAbsencePage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
        roleMiddleware(["Student"]);
    }, []);
    const [selectedMonth, setSelectedMonth] = useState('Januari');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Data statis tabel absensi
    const data = [
        { no: 1, name: "Ilham Kurniawan", class: "X PH A", status: "Hadir", document: null, date: "21/01/2024" },
        { no: 2, name: "Ilham Kurniawan", class: "X PH B", status: "Izin", document: "/images/Berita1.jpg", date: "22/01/2024" },
        { no: 3, name: "Ilham Kurniawan", class: "XI IPA A", status: "Sakit", document: "/images/Berita1.jpg", date: "23/01/2024" },
        { no: 4, name: "Ilham Kurniawan", class: "XI IPA B", status: "Alpha", document: null, date: "24/01/2024" },
        { no: 5, name: "Ilham Kurniawan", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
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
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">


            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Absensi Anda</h1>
                    <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
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
                            <i className='bx bxs-check-circle text-[#1f509a] text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">27</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Hadir</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-envelope text-[#e88d1f]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">2</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Izin</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-clinic text-[#0a97b0]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">0</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Sakit</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-x-circle text-[#bd0000]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">0</p>
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
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.class}</td>
                                        <td className="py-2 px-4 border-b">{item.status}</td>
                                        <td className="py-2 px-4 border-b">
                                            {item.document ? <img src={item.document} alt="Bukti Surat" className="w-16 h-16" /> : '-'}
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.date}</td>
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


                </div>
            </main>
        </div>
    );
}