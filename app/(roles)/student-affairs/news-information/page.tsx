"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import Image from 'next/image';
import { useNewsInformation } from "@/app/hooks/useNewsInformation";
import FormModal from '@/app/components/DataTable/FormModal';
import { NewsInformation } from "@/app/api/news-information/types";



interface FormData {
    [key: string]: any;
}

export default function StudentAffairsNewsInformationPage() {
    const { newsInformation, loading, error, fetchNewsInformation, createNewsInformation, updateNewsInformation, deleteNewsInformation, } = useNewsInformation();
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
    const [formData, setFormData] = useState<NewsInformation>({
        activity: '',
        description: '',
        note: '',
        photo: '',
        date: '',
    });
    const [selectedNews, setSelectedNews] = useState<NewsInformation | null>(null);


    // Form fields untuk modal
    const formFields = [
        {
            name: 'activity',
            label: 'Judul',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan judul aktivitas'
        },
        {
            name: 'description',
            label: 'Deskripsi',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan deskripsi',
            rows: 3
        },
        {
            name: 'note',
            label: 'Catatan',
            type: 'textarea' as const,
            placeholder: 'Masukkan catatan (opsional)',
            rows: 2
        },
        {
            name: 'photo',
            label: 'Gambar',
            type: 'file' as const,
            accept: 'image/*',
            preview: true,
            helperText: 'Upload gambar (PNG, JPG, JPEG)'
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
        data?: NewsInformation
    ) => {
        event.preventDefault(); // Mencegah default behavior

        setModalMode(mode);

        if (mode === 'edit' && data) {
            setSelectedNews(data); // Simpan data yang dipilih ke state selectedNews
            setFormData({
                ...data,
                date: new Date().toISOString().split('T')[0],
            });
        } else {
            setSelectedNews(null); // Reset selectedNews saat mode 'add'
            setFormData({
                activity: '',
                description: '',
                note: '',
                photo: null,
                date: ''
            });
        }
        setIsModalOpen(true);
    };


    // Handle tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null); // Reset selectedNews
        setFormData({
            activity: '',
            description: '',
            note: '',
            photo: '',
            date: ''
        });
    };

    const handleSubmit = async (formData: NewsInformation) => {
        try {
            if (modalMode === "add") {
                // console.log("Submitting new news:", formData);
                await createNewsInformation(formData);
            } else if (modalMode === "edit" && selectedNews?.id) {
                // console.log("Updating news with id:", selectedNews.id);

                // 🔥 Hapus properti yang tidak diperbolehkan sebelum dikirim ke API
                const { id, createdAt, updatedAt, ...validData } = formData;

                // console.log("Sanitized Form Data:", validData);

                const response = await updateNewsInformation(selectedNews.id, validData);
                // console.log("Update success response:", response);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Error submitting news information:", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNewsInformation(id);
        } catch (err) {
            console.error("Error deleting news information:", err);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                setIsAuthorized(true);

                // Fetch all data
                const results = await Promise.all([
                    fetchNewsInformation(),
                ]);

            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Search item tabel
    const filteredData = newsInformation.filter(item =>
        item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        title: "Berita Sekolah",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Informasi Berita</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
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
                                    <th className="py-2 px-4 border-b text-left">Gambar</th>
                                    <th className="py-2 px-4 border-b text-left">Judul</th>
                                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                                    <th className="py-2 px-4 border-b text-left">Catatan</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((newsInformation, index) => (
                                    <tr key={newsInformation.id} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {newsInformation.photo ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/student-information/${newsInformation.photo.split('/').pop()}`}
                                                        alt="Bukti Surat"
                                                        className="w-full h-full object-cover"
                                                        width={256}
                                                        height={256}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">{newsInformation.activity}</td>
                                        <td className="py-2 px-4 border-b">{newsInformation.description}</td>
                                        <td className="py-2 px-4 border-b">{newsInformation.note}</td>
                                        <td className="py-2 px-4 border-b">{formatDate(newsInformation.date)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={(e) => handleOpenModal(e, 'edit', newsInformation)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"

                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(newsInformation.id!)}
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

            {/* Modal Component */}
            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Informasi Berita' : 'Edit Informasi Berita'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div >
    );
}