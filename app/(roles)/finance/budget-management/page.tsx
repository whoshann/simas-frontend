"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import FacilityModal from "@/app/components/FacilityModal.js";

type Entry = {
    no: number;
    judul: string;
    keterangan: string;
    total: number;
    status: "Disetujui" | "Revisi" | "Ditolak";
    date: string;
    document: string;
};

export default function BudgetManagementPage() {
    useEffect(() => {
        // Middleware untuk memeriksa role, hanya izinkan 'Finance'
        roleMiddleware(["Finance"]);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

    const [data, setData] = useState<Entry[]>([
        { no: 1, judul: "Renovasi Lab Komputer", keterangan: "Perbaikan fasilitas lab", total: 20000000, status: "Ditolak", date: "15/12/2024", document: "Proposal_Renovasi_Lab.pdf" },
        { no: 2, judul: "Peralatan Olahraga", keterangan: "Pengadaan bola dan net", total: 5000000, status: "Revisi", date: "15/12/2024", document: "Proposal_Olahraga.pdf" },
        { no: 3, judul: "Workshop Siswa", keterangan: "Pelatihan robotik siswa", total: 15000000, status: "Revisi", date: "15/12/2024", document: "Proposal_Workshop.pdf" },
        { no: 4, judul: "Pengadaan Buku", keterangan: "Buku referensi perpustakaan", total: 3000000, status: "Disetujui", date: "15/12/2024", document: "Proposal_Buku.pdf" },
        { no: 5, judul: "Maintenance Gedung", keterangan: "Perbaikan plafon kelas", total: 10000000, status: "Disetujui", date: "15/12/2024", document: "Proposal_Maintenance.pdf" },
    ]);

    // Filter data berdasarkan search term
    const filteredData = data.filter((item) =>
        item.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleAddClick = () => {
        setSelectedEntry(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (entry: Entry) => {
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (no: number) => {
        setData((prevData) => prevData.filter((item) => item.no !== no));
    };

    const handleModalSubmit = (entry: Entry) => {
        if (selectedEntry) {
            // Update data
            setData((prevData) =>
                prevData.map((item) => (item.no === selectedEntry.no ? entry : item))
            );
        } else {
            // Tambah data baru
            setData((prevData) => [...prevData, { ...entry, no: prevData.length + 1 }]);
        }
        setIsModalOpen(false);
    };

    const handleExportPDF = () => {
        console.log("Export PDF functionality here");
    };

    const handleExportExcel = () => {
        console.log("Export Excel functionality here");
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Manajemen RAB</h1>
                    <p className="text-sm text-gray-600">Halo Admin Keuangan, selamat datang kembali</p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
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

                        <div className="flex space-x-2 mt-5 sm:mt-0">
                            {/* Button Tambah Data */}
                            <button
                                onClick={handleAddClick}
                                className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                            >
                                Tambah Data
                            </button>

                            {/* Button Export PDF */}
                            <button
                                onClick={handleExportPDF}
                                className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                            >
                                Export PDF
                            </button>

                            {/* Button Export Excel */}
                            <button
                                onClick={handleExportExcel}
                                className="bg-[var(--third-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#09859a]"
                            >
                                Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Judul</th>
                                    <th className="py-2 px-4 border-b text-left">Keterangan</th>
                                    <th className="py-2 px-4 border-b text-left">Total</th>
                                    <th className="py-2 px-4 border-b text-left">Dokumen</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Date</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.judul}</td>
                                        <td className="py-2 px-4 border-b">{item.keterangan}</td>
                                        <td className="py-2 px-4 border-b">Rp. {item.total.toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b">{item.document}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.status === "Ditolak" ? 'bg-red-100 text-red-600' : item.status === "Revisi" ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.date}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item.no)}
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
            <FacilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                facilityData={selectedEntry}
            />
        </div>
    );
}
