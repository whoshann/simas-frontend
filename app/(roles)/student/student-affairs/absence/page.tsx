"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';

export default function StudentAffairsAbsence() {
    const [selectedMonth, setSelectedMonth] = useState('Januari');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Data statis
    const data = [
        { no: 1, name: "Ilham Kurniawan", class: "X PH A", status: "Hadir", document: null, date: "21/01/2024" },
        { no: 2, name: "Budi Santoso", class: "X PH B", status: "Izin", document: "bukti_surat.png", date: "22/01/2024" },
        { no: 3, name: "Siti Aminah", class: "XI IPA A", status: "Sakit", document: "bukti_surat.png", date: "23/01/2024" },
        { no: 4, name: "Andi Wijaya", class: "XI IPA B", status: "Alpha", document: null, date: "24/01/2024" },
        { no: 5, name: "Rina Sari", class: "XII IPS A", status: "Hadir", document: null, date: "25/01/2024" },
        { no: 6, name: "Ilham Kurniawan", class: "X PH A", status: "Izin", document: "bukti_surat.png", date: "26/01/2024" },
        { no: 7, name: "Budi Santoso", class: "X PH B", status: "Sakit", document: "bukti_surat.png", date: "27/01/2024" },
        { no: 8, name: "Siti Aminah", class: "XI IPA A", status: "Hadir", document: null, date: "28/01/2024" },
        { no: 9, name: "Andi Wijaya", class: "XI IPA B", status: "Alpha", document: null, date: "29/01/2024" },
        { no: 10, name: "Rina Sari", class: "XII IPS A", status: "Izin", document: "bukti_surat.png", date: "30/01/2024" },
        { no: 11, name: "Ilham Kurniawan", class: "X PH A", status: "Hadir", document: null, date: "31/01/2024" },
        { no: 12, name: "Budi Santoso", class: "X PH B", status: "Izin", document: "bukti_surat.png", date: "01/02/2024" },
        { no: 13, name: "Siti Aminah", class: "XI IPA A", status: "Sakit", document: "bukti_surat.png", date: "02/02/2024" },
        { no: 14, name: "Andi Wijaya", class: "XI IPA B", status: "Alpha", document: null, date: "03/02/2024" },
        { no: 15, name: "Rina Sari", class: "XII IPS A", status: "Hadir", document: null, date: "04/02/2024" },
        { no: 16, name: "Ilham Kurniawan", class: "X PH A", status: "Izin", document: "bukti_surat.png", date: "05/02/2024" },
        { no: 17, name: "Budi Santoso", class: "X PH B", status: "Sakit", document: "bukti_surat.png", date: "06/02/2024" },
        { no: 18, name: "Siti Aminah", class: "XI IPA A", status: "Hadir", document: null, date: "07/02/2024" },
        { no: 19, name: "Andi Wijaya", class: "XI IPA B", status: "Alpha", document: null, date: "08/02/2024" },
        { no: 20, name: "Rina Sari", class: "XII IPS A", status: "Izin", document: "bukti_surat.png", date: "09/02/2024" },
    ];

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
            <header className="py-6 px-9 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Absensi Anda</h1>
                    <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
                </div>
                <div className="relative">
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-center cursor-pointer" onClick={togglePanel}>
                        <span className="text-lg font-semibold">{selectedMonth}</span>
                        <svg className={`ml-2 h-4 w-4 transform transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">
                {/* Card for Show Entries, Search, and Table */}
                <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <div className="mb-4 flex justify-between">
                        <div>
                            <label className="mr-2">Show entries:</label>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
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
                                <tr key={item.no} className="hover:bg-gray-100">
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

                    <div className="flex justify-between items-center mt-4">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries</span>
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                            >
                                &lt;
                            </button>
                            <span>{currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-md ml-2"
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