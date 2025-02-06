"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import { Procurement } from "@/app/api/procurement/types";
import { useProcurements } from "@/app/hooks/useProcurements";
import { getProcurementStatusLabel } from "@/app/utils/enumHelpers";
import { ProcurementStatus } from "@/app/utils/enums";
import { procurementsApi } from "@/app/api/procurement";
import FormModal from '@/app/components/DataTable/FormModal';
import { formatDate } from "@/app/utils/helper";

interface TableProps {
    procurement: Procurement[];
    startIndex: number;
}

export default function ItemRequestPage() {
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                fetchProcurements();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedItem, setSelectedItem] = useState<Procurement | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { procurements, fetchProcurements, updateProcurementStatus } = useProcurements();
    const [formData, setFormData] = useState({
        procurementStatus: '',
        updateMessage: ''
    });

    // Menggunakan data statis untuk filteredData
    const filteredData = procurements.filter((item: Procurement) =>
        item.inventory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.procurementName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Form fields untuk modal
    const formFields = [
        {
            name: 'updateMessage',
            label: 'Alasan',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan alasan',
            rows: 3
        },
        {
            name: 'procurementStatus',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { value: ProcurementStatus.Approved, label: 'Disetujui', style: 'bg-green-500 text-white' },
                { value: ProcurementStatus.Rejected, label: 'Ditolak', style: 'bg-red-500 text-white' },
            ],
        },
    ];

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleAddClick = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleViewPDF = async (filename: string) => {
        try {
            console.log('Mencoba mengakses file:', filename);
            const blob = await procurementsApi.getDocument(filename);
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            alert('Gagal mengambil file PDF: ' + (error.response?.data?.message || 'File tidak ditemukan'));
            console.error('Error fetching PDF:', error);
        }
    };

    const handleDownloadPDF = async (filename: string) => {
        try {
            const blob = await procurementsApi.getDocument(filename);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Gagal mengunduh file PDF');
            console.error('Error downloading PDF:', error);
        }
    };

    // Handle buka modal untuk message
    const handleOpenMessageModal = (
        event: React.MouseEvent<HTMLButtonElement>,
        procurement: Procurement
    ) => {
        event.preventDefault();
        setSelectedItem(procurement);
        setFormData({
            procurementStatus: '',
            updateMessage: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            procurementStatus: '',
            updateMessage: ''
        });
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (!selectedItem?.id) return;

            await updateProcurementStatus(
                selectedItem.id,
                formData.procurementStatus,
                formData.updateMessage
            );

            alert('Status pengajuan berhasil diperbarui!');
            handleCloseModal();
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(error.message);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
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
                            {/* <button
                                onClick={handleAddClick}
                                className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                            >
                                Tambah Data
                            </button> */}

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
                                    <th className="py-2 px-4 border-b text-left">Nama Pengaju</th>
                                    <th className="py-2 px-4 border-b text-left">Role Pengaju</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Dokumen Pengajuan</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item: Procurement, index: number) => (
                                    <tr key={item.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.inventory.name}</td>
                                        <td className="py-2 px-4 border-b">{item.procurementName}</td>
                                        <td className="py-2 px-4 border-b">{item.role}</td>
                                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleViewPDF(item.documentPath)}
                                                className="text-blue-500 underline mr-2"
                                            >
                                                Lihat PDF
                                            </button>
                                            {' | '}
                                            <button
                                                onClick={() => handleDownloadPDF(item.documentPath)}
                                                className="text-blue-500 underline"
                                            >
                                                Unduh PDF
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border-b">{formatDate(item.procurementDate)}</td>
                                        <td className="py-2 px-4 border-b">{getProcurementStatusLabel(item.procurementStatus as ProcurementStatus)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {item.procurementStatus !== 'Approved' && item.procurementStatus !== 'Rejected' && (
                                                    <>
                                                        {/* Centang (Check) Button */}
                                                        <button
                                                            onClick={(event) => handleOpenMessageModal(event, item)}
                                                            className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                        >
                                                            <i className="bx bx-check text-lg"></i>
                                                        </button>

                                                        {/* Cancel Button */}
                                                        
                                                    </>
                                                )}
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

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title="Message Pengelolaan Barang"
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div>
    );
}
