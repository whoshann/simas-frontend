"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useBudgetManagement } from "@/app/hooks/useBudgetManagement";
import FormModal from '@/app/components/DataTable/FormModal';
import { BudgetManagement } from "@/app/api/budget-management/types";
import { BudgetManagementStatus } from "@/app/utils/enums";
import { BudgetManagementStatusLabel } from "@/app/utils/enumHelpers";
import { budgetManagementApi } from "@/app/api/budget-management";
import { formatRupiah, formatDate } from "@/app/utils/helper";
import { useUser } from "@/app/hooks/useUser";
import { showErrorAlert, showSuccessAlert } from "@/app/utils/sweetAlert";
import { exportToExcel, ExportConfigs } from '@/app/utils/exportToExcel';

interface FormData {
    [key: string]: any;
}

export default function BudgetManagementPage() {
    const { budgetManagement, loading, fetchBudgetManagement, updateBudgetStatus } = useBudgetManagement();
    const { user } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedBudget, setSelectedBudget] = useState<BudgetManagement | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    // Form fields untuk modal
    const formFields = [
        {
            name: 'reason',
            label: 'Alasan',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan alasan',
            rows: 3
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { value: BudgetManagementStatus.Approved, label: 'Disetujui', style: 'bg-green-500 text-white' },
                { value: BudgetManagementStatus.Revised, label: 'Revisi', style: 'bg-yellow-500 text-white' },
                { value: BudgetManagementStatus.Rejected, label: 'Ditolak', style: 'bg-red-500 text-white' },
            ],
        },
    ];

    // Handle buka modal untuk message
    const handleOpenMessageModal = (
        event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
        data?: BudgetManagement
    ) => {
        event.preventDefault(); // Mencegah default behavior
        setSelectedBudget(data || null);
        setIsModalOpen(true);
    };

    // Handle tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBudget(null);
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (!selectedBudget?.id) return;

            await updateBudgetStatus(
                selectedBudget.id,
                formData.status,
                formData.reason // reason akan menjadi updateMessage
            );

            await showSuccessAlert('Success', 'Status RAB berhasil diperbarui!');
            handleCloseModal();
        } catch (error: any) {
            console.error("Error updating status:", error);
            await showErrorAlert('Error', 'Gagal memperbarui status RAB');
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance"]);
                setIsAuthorized(true);

                // Fetch all data
                const results = await Promise.all([
                    fetchBudgetManagement(),
                ]);

            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Search item tabel
    const filteredData = budgetManagement.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleViewPDF = async (filename: string) => {
        try {
            console.log('Mencoba mengakses file:', filename);
            const blob = await budgetManagementApi.getDocument(filename);
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            await showErrorAlert('Error', 'Gagal mengambil file PDF: ' + (error.response?.data?.message || 'File tidak ditemukan'));
            console.error('Error fetching PDF:', error);
        }
    };

    const handleDownloadPDF = async (filename: string) => {
        try {
            const blob = await budgetManagementApi.getDocument(filename);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            await showErrorAlert('Error', 'Gagal mengunduh file PDF');
            console.error('Error downloading PDF:', error);
        }
    };

    const handleExport = () => {
        if (filteredData && filteredData.length > 0) {
            const formattedData = filteredData.map((item, index) => ({
                'No': index + 1,
                'Nama': item.user.username,
                'Role': item.user.role,
                'Judul': item.title,
                'Deskripsi': item.description,
                'Jumlah': formatRupiah(item.total_budget),
                'Status': BudgetManagementStatusLabel[item.status],
                'Tanggal': formatDate(item.created_at || ''),
                
            }));

            exportToExcel(formattedData, 'Data RAB');
        } else {
            console.error('Tidak ada data untuk diekspor');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Page content configuration
    const pageContent = {
        title: "Pengelolaan RAB",
        greeting: "Halo Admin Keuangan, selamat datang kembali"
    };

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pengelolaan RAB</h1>
                    <p className="text-sm text-gray-600">Halo {user?.username}, selamat datang kembali</p>
                </div>
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
                                            onClick={handleExport}
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
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Role</th>
                                    <th className="py-2 px-4 border-b text-left">Judul</th>
                                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Dokumen</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((budgetManagement, index) => (
                                    <tr key={budgetManagement.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.user.username}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.user.role}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.title}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.description}</td>
                                        <td className="py-2 px-4 border-b">{formatRupiah(budgetManagement.total_budget)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleViewPDF(budgetManagement.document_path)}
                                                className="text-[var(--main-color)] underline mr-2"
                                            >
                                                Lihat PDF
                                            </button>
                                            {' | '}
                                            <button
                                                onClick={() => handleDownloadPDF(budgetManagement.document_path)}
                                                className="text-[var(--third-color)] underline"
                                            >
                                                Unduh PDF
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border-b">{formatDate(budgetManagement.created_at || '')}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${budgetManagement.status === "Submitted"
                                                    ? "bg-[#1f509a26] text-[var(--main-color)]"
                                                    : budgetManagement.status === "Approved"
                                                        ? "bg-[#0a97b022] text-[var(--third-color)]"
                                                        : budgetManagement.status === "Revised" ? "bg-[#e88e1f29] text-[var(--second-color)]"
                                                            : "bg-[#bd000025] text-[var(--fourth-color)]"
                                                    }`}
                                            >
                                                {BudgetManagementStatusLabel[budgetManagement.status]}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {budgetManagement.status === BudgetManagementStatus.Submitted && (
                                                    <button
                                                        onClick={(e) => handleOpenMessageModal(e, budgetManagement)}
                                                        className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                    >
                                                        <i className="bx bxs-message text-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentEntries.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4">Tidak ada data</td>
                                    </tr>
                                )}
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

            {/* Modal Component */}
            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title="Message Pengelolaan RAB"
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div >
    );
}