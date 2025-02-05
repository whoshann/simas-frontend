"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from 'next/image';
import { usePaymentSpp } from "@/app/hooks/usePaymentSpp";
import FormModal from '@/app/components/DataTable/FormModal';
import { PaymentSpp } from "@/app/api/payment-spp/types";



interface FormData {
    [key: string]: any;
}

export default function SppPage() {
    const { paymentSpp, loading, error, fetchPaymentSpp, createPaymentSpp, updatePaymentSpp, deletePaymentSpp, } = usePaymentSpp();
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
    const [formData, setFormData] = useState<PaymentSpp>({
        name: '',
        quantity: '',
        month: new Date().getMonth() + 1,
        status: '',
        transactionId: '',
        date: '',
    });
    const [selectedPayment, setSelectedPayment] = useState<PaymentSpp | null>(null);


    // Form fields untuk modal
    const formFields = [
        {
            name: 'name',
            label: 'Judul',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan judul aktivitas'
        },
        {
            name: 'quantity',
            label: 'Jumlah',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan jumlah'
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'lunas', label: 'Lunas' },
                { value: 'belum lunas', label: 'Belum Lunas' }
            ],
            placeholder: 'Pilih status'
        },
        {
            name: 'transactionId',
            label: 'ID Transaksi',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan ID transaksi'
        },
        {
            name: 'date',
            label: 'Tanggal',
            type: 'date' as const,
            required: true
        }
    ];

    // Handle buka modal
    const handleOpenModal = (
        event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
        mode: 'add' | 'edit',
        data?: PaymentSpp
    ) => {
        event.preventDefault(); // Mencegah default behavior

        setModalMode(mode);

        if (mode === 'edit' && data) {
            setSelectedPayment(data); // Simpan data yang dipilih ke state selectedNews
            setFormData({
                ...data,
                date: new Date().toISOString().split('T')[0],
            });
        } else {
            setSelectedPayment(null); // Reset selectedNews saat mode 'add'
            setFormData({
                name: '',
                quantity: '',
                month: new Date().getMonth() + 1,
                status: '',
                transactionId: '',
                date: ''
            });
        }
        setIsModalOpen(true);
    };


    // Handle tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null); // Reset selectedNews
        setFormData({
            name: '',
            quantity: '',
            month: new Date().getMonth() + 1,
            status: '',
            transactionId: '',
            date: ''
        });
    };

    const handleSubmit = async (formData: PaymentSpp) => {
        try {
            if (modalMode === "add") {
                // console.log("Submitting new news:", formData);
                await createPaymentSpp(formData);
            } else if (modalMode === "edit" && selectedPayment?.id) {
                // console.log("Updating Payment with id:", selectedPayment.id);

                // Hapus properti yang tidak diperbolehkan sebelum dikirim ke API
                const { id, createdAt, updatedAt, ...validData } = formData;

                // console.log("Sanitized Form Data:", validData);

                const response = await updatePaymentSpp(selectedPayment.id, validData);
                // console.log("Update success response:", response);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Error submitting payment spp:", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePaymentSpp(id);
        } catch (err) {
            console.error("Error deleting payment spp:", err);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance", "SuperAdmin"]);
                setIsAuthorized(true);

                // Fetch all data
                const results = await Promise.all([
                    fetchPaymentSpp(),
                ]);

            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Search item tabel
    const filteredData = paymentSpp.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(item.date).includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = [
        { id: 1, name: 'Kila', quantity: '100.000', month: 1, status: 'lunas', transactionId: 'TRX001', date: '2023-01-15' },
        { id: 2, name: 'Ula', quantity: '100.000', month: 2, status: 'belum lunas', transactionId: 'TRX002', date: '2023-02-20' },
        { id: 3, name: 'Rasya', quantity: '100.000', month: 3, status: 'lunas', transactionId: 'TRX003', date: '2023-03-10' },
        { id: 4, name: 'Zahwa', quantity: '100.000', month: 4, status: 'belum lunas', transactionId: 'TRX004', date: '2023-04-05' },
        { id: 5, name: 'Lulu', quantity: '100.000', month: 5, status: 'lunas', transactionId: 'TRX005', date: '2023-05-25' },
    ];
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (loading) {
        return <LoadingSpinner />;
    }

    // Page content configuration
    const pageContent = {
        title: "Spp",
        greeting: "Halo Admin Keuangan, selamat datang kembali"
    };

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Spp</h1>
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
                            {/* Button Tambah Data */}
                            <button
                                onClick={(e) => handleOpenModal(e, 'add')}
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
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Bulan</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Transaksi Id</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((paymentSpp, index) => (
                                    <tr key={paymentSpp.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{paymentSpp.name}</td>
                                        <td className="py-2 px-4 border-b">{paymentSpp.quantity}</td>
                                        <td className="py-2 px-4 border-b">{paymentSpp.month}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-3 py-1 rounded-full text-xs ${
                                                paymentSpp.status === 'lunas' 
                                                    ? 'bg-green-100 text-green-600' 
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {paymentSpp.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{paymentSpp.transactionId}</td>
                                        <td className="py-2 px-4 border-b">{formatDate(paymentSpp.date)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={(e) => handleOpenModal(e, 'edit', paymentSpp)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"

                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(paymentSpp.id!)}
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
            {/* test */}
            {/* Modal Component */}
            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Spp' : 'Edit Spp'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div >
    );
}