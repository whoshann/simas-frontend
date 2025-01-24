"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";

export default function StudentViolationsPage() {
    // Panggil middleware dan hooks di awal komponen
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student","SuperAdmin"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
    
        initializePage();
    }, []);

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const token = Cookies.get("token");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Data statis tabel absensi
    const data = [
        { no: 1, violation: "Merokok", category: "Ringan", punishment: "Skors 2 tahun", document: "/images/Berita1.jpg", date: "22/01/2024" },
        { no: 2, violation: "Membongkar perpustakaan", category: "Berat", punishment: "SP 3", document: "/images/Berita1.jpg", date: "23/01/2024" },
        { no: 3, violation: "Menjambak satpam", category: "Sedang", punishment: "Penjara 1 tahun", document: "/images/Berita1.jpg", date: "23/01/2024" },


    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.violation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.punishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
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


            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Point Pelanggaran</h1>
                    <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
                </div>
            </header>
            {/* End Header */}

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">


                {/* Start 3 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Kolom Kedua: Card 1, Card 2, dan Card 3 */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Card 1 */}
                            <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                                <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                    <i className='bx bxs-check-circle text-[#1f509a] text-4xl'></i>
                                </div>
                                <div>
                                    <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Ringan</p>
                                    <p className="text-sm text-[var(--text-regular-color)]">5 Point</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                                <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                    <i className='bx bxs-error-circle text-[#e88d1f] text-4xl'></i>
                                </div>
                                <div>
                                    <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Sedang</p>
                                    <p className="text-sm text-[var(--text-regular-color)]">20 Point</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                            <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                <i className='bx bxs-x-circle text-[#bd0000] text-4xl'></i>
                            </div>
                            <div>
                                <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Berat</p>
                                <p className="text-sm text-[var(--text-regular-color)]">50 Point</p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Pertama: Card Besar */}
                    <div className="bg-[var(--main-color)] shadow-md rounded-lg col-span-1 flex items-center justify-center h-64">
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="bg-[#ffffff38] rounded-full p-3 mb-2 mr-0 sm:mr-5 w-20 h-20 flex items-center justify-center">
                                <div className="rounded-full bg-white w-12 h-12 flex items-center justify-center">
                                    <span className="text-xl font-bold text-[#1f509a]">75</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl text-white font-bold">Total Point Anda</p>
                                <p className="text-sm text-white">75 / 100 ( Surat Peringatan 1 )</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Cards */}


                {/* Card for Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="mb-4 flex justify-between">

                        {/* Start Showing entries */}
                        <div className="text-xs sm:text-xs">
                            <label className="mr-2">Tampilkan</label>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-1 text-xs sm:text-xs w-12 sm:w-16">
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
                                    <th className="py-2 px-4 border-b text-left">Pelanggaran</th>
                                    <th className="py-2 px-4 border-b text-left">Bukti Foto</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Hukuman</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.violation}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className=" w-16 h-16 overflow-hidden rounded">
                                                {item.document ? (
                                                    <Image
                                                        src={item.document}
                                                        alt="Bukti Foto"
                                                        className="w-full h-full object-cover"
                                                        width={256}
                                                        height={256}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </div></td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.category === 'Ringan' ? 'bg-[#0a97b028] text-[var(--third-color)]' : item.category === 'Sedang' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : item.category === 'Berat' ? 'bg-[#bd000025] text-[var(--fourth-color)]' : ''}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.punishment}</td>
                                        <td className="py-2 px-4 border-b">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* End Table */}



                    {/*Start Pagination and showing entries */}
                    <div className="flex justify-between items-center mt-5">
                        <span className="text-xs sm:text-xs" >Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

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