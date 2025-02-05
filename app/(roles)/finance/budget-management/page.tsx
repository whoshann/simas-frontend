"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from 'next/image';
import { useBudgetManagement } from "@/app/hooks/useBudgetManagement";
import FormModal from '@/app/components/DataTable/FormModal';
import { BudgetManagement } from "@/app/api/budget-management/types";
import { DispenseStatus } from "@/app/utils/enums";

interface FormData {
    [key: string]: any;
}

export default function BudgetManagementPage() {
    const { budgetManagement, loading, fetchBudgetManagement } = useBudgetManagement();
    const [user, setUser] = useState<any>({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<BudgetManagement>({
        name: '',
        role: '',
        title: '',
        description: '',
        amount: 0,
        document: '',
        status: DispenseStatus.Pending,
        date: ''
    });
    const [selectedBudget, setSelectedBudget] = useState<BudgetManagement | null>(null);

    const dummyData: BudgetManagement[] = [
        {
            id: 1,
            name: 'John Doe',
            role: 'Guru',
            title: 'Budget Approval',
            description: 'Approval for the budget of Q1',
            amount: 1000000,
            document: 'document1.pdf',
            status: DispenseStatus.Pending,
            date: '2023-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            role: 'Guru',
            title: 'Budget Request',
            description: 'Request for additional funds',
            amount: 500000,
            document: 'document2.pdf',
            status: DispenseStatus.Approved,
            date: '2023-02-20'
        },
        // Tambahkan lebih banyak data dummy sesuai kebutuhan
    ];

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
                { value: DispenseStatus.Approved, label: 'Disetujui', style: 'bg-green-500 text-white' },
                { value: DispenseStatus.Pending, label: 'Menunggu', style: 'bg-yellow-500 text-white' },
                { value: DispenseStatus.Rejected, label: 'Ditolak', style: 'bg-red-500 text-white' },
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
        setFormData({
            ...data,
            status: DispenseStatus.Approved,
            name: data?.name || '',
            role: data?.role || '',
            title: data?.title || '',
            description: data?.description || '',
            amount: data?.amount || 0,
            document: data?.document || '',
            date: data?.date || ''
        });
        setIsModalOpen(true);
    };

    // Handle tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBudget(null); 
        setFormData({
            name: '',
            role: '',
            title: '',
            description: '',
            amount: 0,
            document: '',
            status: DispenseStatus.Pending,
            date: ''
        });
    };

    const handleSubmit = async (formData: BudgetManagement) => {
        handleCloseModal();
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
    const filteredData = dummyData.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                    <p className="text-sm text-gray-600">Halo Admin Keuangan, selamat datang kembali</p>
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
                                        <td className="py-2 px-4 border-b">{budgetManagement.name}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.role}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.title}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.description}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.amount}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.document}</td>
                                        <td className="py-2 px-4 border-b">{formatDate(budgetManagement.date)}</td>
                                        <td className="py-2 px-4 border-b">{budgetManagement.status === DispenseStatus.Approved ? 'Disetujui' : budgetManagement.status === DispenseStatus.Pending ? 'Menunggu' : 'Ditolak'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => handleOpenMessageModal(e, budgetManagement)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-message text-lg"></i>
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