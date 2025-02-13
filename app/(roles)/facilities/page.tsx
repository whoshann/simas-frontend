"use client";

import "@/app/styles/globals.css";
import { useState, useRef, useEffect } from 'react';
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useDashboardFacilities } from "@/app/hooks/useDashboardFacilities";
import React from "react";
import { useUser } from "@/app/hooks/useUser";

interface CircleProgressBarProps {
    percentage: number;
    label: string;
    color: string;
    backgroundColor: string; // Menambahkan backgroundColor
}

export default function FacilitiesDashboardPage() {
    const { user } = useUser();
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    const [isAuthorized, setIsAuthorized] = useState(false);
    const months = [
        'Semua', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const { dashboardData, loading, error, refreshData } = useDashboardFacilities();

    // Data statis untuk tabel perbaikan
    const repairData = dashboardData.repairs;

    // Pindahkan fungsi filterDataByMonth ke sini
    const filterDataByMonth = (date: string) => {
        if (!date) return false;
        if (selectedMonth === 'Semua') return true; // Tampilkan semua data jika 'Semua' dipilih

        const itemDate = new Date(date);
        return itemDate.getMonth() === months.indexOf(selectedMonth) - 1 && // Kurangi 1 karena ada 'Semua' di index 0
            itemDate.getFullYear() === selectedYear;
    };

    // Filter data
    const filteredRepairs = dashboardData.repairs
        .filter(item => filterDataByMonth(item.date))
        .filter(item => {
            if (!searchTerm) return true;

            const searchValue = searchTerm.toLowerCase();
            const displayDate = new Date(item.date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            // Status yang ditampilkan di tabel
            const displayStatus = item.status === 'Completed'
                ? 'Selesai'
                : item.status === 'InProgress'
                    ? 'Sedang Dikerjakan'
                    : 'Pending';

            return (
                item.category.toLowerCase().includes(searchValue) ||
                displayDate.toLowerCase().includes(searchValue) ||
                displayStatus.toLowerCase().includes(searchValue)
            );
        });

    // Hitung total entries dan pagination
    const totalEntries = filteredRepairs.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;

    // Slice data untuk halaman saat ini
    const currentEntries = filteredRepairs.slice(startIndex, endIndex);

    // Filter data untuk card summary
    const filteredDashboardData = {
        incomingGoods: selectedMonth === 'Semua'
            ? dashboardData.incomingGoods.length
            : dashboardData.incomingGoods.filter(item => filterDataByMonth(item.formattedDate)).length,
        outgoingGoods: selectedMonth === 'Semua'
            ? dashboardData.outgoingGoods.length
            : dashboardData.outgoingGoods.filter(item => filterDataByMonth(item.formattedDate)).length,
        totalInventory: selectedMonth === 'Semua'
            ? dashboardData.totalInventory.length
            : dashboardData.totalInventory.filter(item => filterDataByMonth(item.formattedDate)).length,
        totalRooms: selectedMonth === 'Semua'
            ? dashboardData.totalRooms.length
            : dashboardData.totalRooms.filter(item => filterDataByMonth(item.formattedDate)).length,
        latestBorrowings: selectedMonth === 'Semua'
            ? dashboardData.latestBorrowings
            : dashboardData.latestBorrowings.filter(item => filterDataByMonth(item.date)),
        repairs: selectedMonth === 'Semua'
            ? dashboardData.repairs
            : dashboardData.repairs.filter(item => filterDataByMonth(item.date)),
        latestProcurements: selectedMonth === 'Semua'
            ? dashboardData.latestProcurements
            : dashboardData.latestProcurements.filter(item => filterDataByMonth(item.date)),
        totalApprovedItems: selectedMonth === 'Semua'
            ? dashboardData.latestProcurements
                .filter(item => item.procurementStatus === 'Approved')
                .reduce((total, item) => total + Number(item.quantity), 0)
            : dashboardData.latestProcurements
                .filter(item => filterDataByMonth(item.date) && item.procurementStatus === 'Approved')
                .reduce((total, item) => total + Number(item.quantity), 0),

    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

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
                        Halo {user?.username}, selamat datang kembali
                    </p>
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

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">


                {/* Start 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center  ">
                            <i className='bx bxs-package text-[#1f509a] text-4xl'></i> {/* Ikon untuk Barang Masuk */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{filteredDashboardData.incomingGoods}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Barang Masuk</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-package text-[#e88d1f] text-4xl'></i> {/* Ikon untuk Barang Keluar */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{filteredDashboardData.totalApprovedItems}</p>

                            <p className="text-sm text-[var(--text-regular-color)]">Barang Keluar</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-store text-[#0a97b0] text-3xl'></i> {/* Ikon untuk Stok Barang */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{filteredDashboardData.totalInventory}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Stok Barang</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-door-open text-[#bd0000] text-4xl'></i> {/* Ikon untuk Total Ruang */}
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{filteredDashboardData.totalRooms}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Total Ruang</p>
                        </div>
                    </div>
                </div>
                {/* End Cards */}


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">Peminjaman Barang</h3>
                            <a href="/facilities/goods-management/outgoing-goods" className="bg-[var(--main-color)] text-white px-4 py-2 rounded-full">Lihat Detail</a>
                        </div>
                        <div className="flex flex-col">
                            {filteredDashboardData.latestBorrowings.map((borrowing, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-[var(--main-color)] rounded-full mr-2"></div>
                                    <div>
                                        <p>Peminjaman barang: {borrowing.name}.</p>
                                        <span className="text-[var(--text-regular-color)]">{borrowing.date}</span>
                                    </div>
                                </div>
                            ))}

                            {filteredDashboardData.latestBorrowings.length === 0 && (
                                <div className="text-center text-gray-500">
                                    Tidak ada data peminjaman
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 2 (Pengajuan Barang) */}
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)] ">Pengajuan Barang</h3>
                            <a href="/facilities/goods-management/item-request" className="bg-[var(--main-color)] text-white px-4 py-2 rounded-full">Lihat Detail</a>

                        </div>

                        <div className="flex flex-col">
                            {filteredDashboardData.latestProcurements.map((procurement, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-[var(--main-color)] rounded-full mr-2"></div>
                                    <div>
                                        <p>Pengajuan barang baru: {procurement.inventory?.name}</p>
                                        <span className="text-[var(--text-regular-color)]">{procurement.date}</span>
                                    </div>
                                </div>
                            ))}

                            {filteredDashboardData.latestProcurements.length === 0 && (
                                <div className="text-center text-gray-500">
                                    Tidak ada data pengajuan barang
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Card for Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">


                    <div className="mb-4 flex justify-between ">

                        {/* Start Showing entries */}
                        <div className="">
                            <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]"> Jenis Perbaikan </span>
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
                                    <th className="py-2 px-4 border-b text-left">Jenis Perbaikan</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-1 px-2 border-b">{startIndex + index + 1}</td>
                                        <td className="py-1 px-2 border-b">{item.category}</td>
                                        <td className="py-1 px-2 border-b">{item.date}</td>
                                        <td className="py-1 px-2 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.statusColor}`}>
                                                {item.status === 'Completed'
                                                    ? 'Selesai'
                                                    : item.status === 'InProgress'
                                                        ? 'Sedang Dikerjakan'
                                                        : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {currentEntries.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-500 py-4">Tidak ada data perbaikan</td>
                                    </tr>
                                )}
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
            </div>
        </main>
    );
}