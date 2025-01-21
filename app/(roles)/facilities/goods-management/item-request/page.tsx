"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import ItemModal from "@/app/components/ItemModal.js";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";

type Item = {
    no: number;
    itemName: string;
    unitPrice: number;
    amountPrice: number;
    supplier?: string;
    requestDate: string;
    requester: string;
};

export default function ItemRequestPage() {
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    const token = Cookies.get("token");
    const [user, setUser] = useState<any>({});
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const data = [

        {
            no: 1,
            itemName: "Papan Tulis",
            unitPrice: 54000,
            amountPrice: 108000,
            supplier: "Sinar Jaya",
            requestDate: "13/01/2025",
            requester: "John Doe", // Added requester field
        },
        {
            no: 2,
            itemName: "Meja Guru",
            unitPrice: 150000,
            amountPrice: 300000,
            supplier: "Mebel Sejahtera",
            requestDate: "13/01/2025",
            requester: "Jane Smith", // Added requester field
        },
        {
            no: 3,
            itemName: "Kursi Siswa",
            unitPrice: 75000,
            amountPrice: 1500000,
            supplier: "Perabotan Cerdas",
            requestDate: "13/01/2025",
            requester: "Mark Lee", // Added requester field
        },      
    ];

  
    // Search item tabel
    const filteredData = data.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requester.toLowerCase().includes(searchTerm.toLowerCase())
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
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (item: Item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Item) => {
        if (selectedItem) {
            // Update data
            console.log("Edit Data", data);
        } else {
            // Tambah data baru
            console.log("Tambah Data", data);
        }
    };
    const handleCheckClick = (item: Item) => {
        console.log("Centang clicked for item: ", item);
    };
    
    const handleCancelClick = (item: Item) => {
        console.log("Cancel clicked for item: ", item);
    };

     if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null;
    }
    

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Pengajuan Barang</h1>
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
                                    <th className="py-2 px-4 border-b text-left">Harga Satuan</th>
                                    <th className="py-2 px-4 border-b text-left">Total Harga</th>
                                    <th className="py-2 px-4 border-b text-left">Pemasok</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Pengajuan</th>
                                    <th className="py-2 px-4 border-b text-left">Pengaju</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.itemName}</td>
                                        <td className="py-2 px-4 border-b">{item.unitPrice}</td>
                                        <td className="py-2 px-4 border-b">{item.amountPrice}</td>
                                        <td className="py-2 px-4 border-b">{item.supplier}</td>
                                        <td className="py-2 px-4 border-b">{item.requestDate}</td>
                                        <td className="py-2 px-4 border-b">{item.requester}</td>
 

                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Centang (Check) Button */}
                                                <button
                                                    onClick={() => handleCheckClick(item)} // Handle check action
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bx-check text-lg"></i> {/* Check icon */}
                                                </button>

                                                {/* Cancel Button */}
                                                <button
                                                    onClick={() => handleCancelClick(item)} // Handle cancel action
                                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                                >
                                                    <i className="bx bx-x text-lg"></i> {/* Cross icon */}
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
            <ItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                itemData={selectedItem}
            />
        </div>
    );
}
