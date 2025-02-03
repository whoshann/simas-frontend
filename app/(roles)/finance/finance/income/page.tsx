"use client";

import { useIncome } from "@/app/hooks/useIncomes";
import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { authApi } from "@/app/api/auth";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import FormModal from '@/app/components/DataTable/FormModal';
import { Income } from "@/app/api/incomes/types";
import { formatDateDisplay } from "@/app/utils/helper";
    
// Perbaikan fungsi formatRupiah
const formatRupiah = (angka: string | number) => {
    const number = angka.toString().replace(/[^,\d]/g, '');
    const split = number.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return `Rp ${rupiah}`;
};

export default function IncomePage() {
    const { incomes, loading, error, fetchIncomes, addIncome, updateIncome, deleteIncome } = useIncome();
    
    // State untuk table
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState({
        source: '',
        description: '',
        amount: 0,
        incomeDate: '',
        monthlyFinanceId: 1
    });

    // Tambahkan state untuk nilai yang diformat
    const [formattedIncome, setFormattedIncome] = useState('');

   useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance"]);
                setIsAuthorized(true);
                await fetchIncomes();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (!isAuthorized) {
        return null;
    }

    // Filter dan pagination logic
    const filteredData = incomes.filter(item =>
        item.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleOpenModal = (mode: 'add' | 'edit', item?: Income) => {
        setModalMode(mode);
        if (mode === 'edit' && item) {
            setFormData({
                source: item.source || '',
                description: item.description || '',
                amount: item.amount || 0,
                incomeDate: item.incomeDate || '',
                monthlyFinanceId: item.monthlyFinanceId || 1
            });
            setFormattedIncome(formatRupiah(item.amount));
        } else {
            setFormData({
                source: '',
                description: '',
                amount: 0,
                incomeDate: '',
                monthlyFinanceId: 1
            });
            setFormattedIncome('');
          
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            source: '',
            description: '',
            amount: 0,
            incomeDate: '',
            monthlyFinanceId: 1
        });
    };

    const handleSubmit = async (data: Partial<Income>) => {
        console.log('Data yang diterima:', data);
        
        
        const formDataToSubmit: Omit<Income, "id"> = {
            source: data.source || '',
            description: data.description || '',
            amount: Number(data.amount) || 0,
            incomeDate: data.incomeDate || '',
            monthlyFinanceId: data.monthlyFinanceId || 1
        };

        try {
            if (modalMode === 'edit' && selectedIncome) {
                
                await updateIncome(selectedIncome.id!, formDataToSubmit);
            } else {
                await addIncome(formDataToSubmit);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pemasukan bulanan ini?')) {
            try {
                await deleteIncome(id);
                // Tambahkan logika untuk memperbarui state setelah penghapusan
                await fetchIncomes(); // Memperbarui data setelah penghapusan
            } catch (error) {
                console.error('Error deleting pemasukan bulanan:', error);
            }
        }
    };

    // Update pada handleRupiahInput
    const handleRupiahInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        
        setFormData(prev => {
            const updatedData = {
                ...prev,
                [field]: value,
            };
            return updatedData;
        });
        
        // Set nilai yang diformat
        if (field === 'amount') {
            setFormattedIncome(value ? formatRupiah(value) : '');
        }
    };

    // Definisikan pageContent
    const pageContent = {
        title: "Pemasukan Bulanan",
        greeting: "Kelola data pemasukan bulanan"
    };

    // Definisikan formFields
    const formFields = [
        { name: 'source', label: 'Sumber', type: 'text' as const },
        { name: 'description', label: 'Deskripsi', type: 'text' as const },
        { name: 'amount', label: 'Jumlah', type: 'number' as const,
            value: formattedIncome || formData.amount,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleRupiahInput(e, 'amount'),
            placeholder: '0'
        },
        { name: 'incomeDate', label: 'Tanggal Pemasukan', type: 'month' as const },
 
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <main className="px-9 pb-6 pt-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    {/* Page Content */}
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--text-bold-color)]">{pageContent.title}</h1>
                        <p className="text-sm text-gray-500">{pageContent.greeting}</p>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[var(--main-color)]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <i className="bx bx-search text-gray-400"></i>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
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
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                            >
                                Tambah Data
                            </button>

                            <button
                                onClick={() => console.log("Import CSV")}
                                className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                            >
                                Import Dari Excel
                            </button>

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
                                        className={`w-4 h-4 ml-2 transform transition-transform ${dropdownOpen ? 'rotate-90' : 'rotate-0'}`}
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
                                    <th className="py-2 px-4 border-b text-left">Sumber Pemasukan</th>
                                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Pemasukan</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.source}</td>
                                        <td className="py-2 px-4 border-b">{item.description}</td>
                                        <td className="py-2 px-4 border-b">{item.incomeDate}</td>                                        
                                        <td className="py-2 px-4 border-b">{formatRupiah(item.amount)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', item)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
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
                        <span className="text-xs sm:text-base">
                            Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
                        </span>

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
                                            className={`rounded-md px-3 py-1 ${
                                                currentPage === pageNumber 
                                                    ? 'bg-[var(--main-color)] text-white' 
                                                    : 'text-[var(--main-color)]'
                                            }`}
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
                title={modalMode === 'add' ? 'Tambah Data Pemasukan Bulanan' : 'Edit Data Pemasukan Bulanan'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div>
    );
}