"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useMajors } from '@/app/hooks/useMajorData';
import FormModal from "@/app/components/DataTable/FormModal";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { useUser } from "@/app/hooks/useUser";

export default function MajorPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedData, setSelectedData] = useState<any>(null);
    const { user } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });

    const {
        majors,
        loading,
        error,
        fetchMajors,
        createMajor,
        updateMajor,
        deleteMajor
    } = useMajors();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                await fetchMajors();
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Form fields configuration
    const formFields = [
        {
            name: 'name',
            label: 'Nama Jurusan',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama jurusan'
        },
        {
            name: 'code',
            label: 'Kode Jurusan',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan kode jurusan'
        }
    ];

    const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && data) {
            setFormData({
                name: data.name,
                code: data.code
            });
            setSelectedData(data);
        } else {
            setFormData({
                name: '',
                code: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
        setFormData({
            name: '',
            code: ''
        });
    };

    const handleSubmit = async (formData: any) => {
        try {
            const majorData = {
                name: formData.name.trim(),
                code: formData.code.trim()
            };

            if (modalMode === 'add') {
                await createMajor(majorData);
                await showSuccessAlert('Berhasil', 'Data jurusan berhasil ditambahkan');
            } else {
                await updateMajor(selectedData.id, majorData);
                await showSuccessAlert('Berhasil', 'Data jurusan berhasil diperbarui');
            }
            handleCloseModal();
            await fetchMajors();
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menyimpan data jurusan');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const isConfirmed = await showConfirmDelete(
                'Hapus Data',
                'Apakah Anda yakin ingin menghapus data ini?'
            );

            if (isConfirmed) {
                await deleteMajor(id);
                await showSuccessAlert('Berhasil', 'Data jurusan berhasil dihapus');
                await fetchMajors();
            }
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menghapus data jurusan');
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const totalEntries = majors.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Filter data
    const filteredData = majors.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentEntries = filteredData.slice(startIndex, endIndex);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
        <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Jurusan</h1>
                <p className="text-sm text-gray-600">Halo {user?.username || 'User'}, selamat datang kembali</p>
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
                            onClick={() => handleOpenModal('add')}
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
                                <th className="py-2 px-4 border-b text-left">Nama Jurusan</th>
                                <th className="py-2 px-4 border-b text-left">Kode Jurusan</th>
                                <th className="py-2 px-4 border-b text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{item.name}</td>
                                    <td className="py-2 px-4 border-b">{item.code}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleOpenModal('edit', item)}
                                                className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                            >
                                                <i className="bx bxs-edit text-lg"></i>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(item.id)}
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

                <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Data Jurusan' : 'Edit Data Jurusan'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
            </div>
        </main>
    </div>
    );
}