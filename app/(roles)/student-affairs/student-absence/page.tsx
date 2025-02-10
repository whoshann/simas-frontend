"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useAbsence } from "@/app/hooks/useAbsence";
import { Absence } from "@/app/api/absence/types";
import { AbsenceStatus } from "@/app/utils/enums";
import { getAbsenceStatusLabel } from '@/app/utils/enumHelpers';
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useUser } from "@/app/hooks/useUser";
import { generateAbsenceReport } from '@/app/utils/pdfTemplates/absenceReport/absenceReport';


export default function StudentAffairsAbsencePage() {
    // States
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Absence | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Hooks
    const { absence, loading, error, fetchAbsence, updateAbsence, deleteAbsence } = useAbsence();
    const { user } = useUser();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                setIsAuthorized(true);
                await fetchAbsence();
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Handle delete
    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Absensi',
            'Apakah Anda yakin ingin menghapus data absensi ini?'
        );

        if (isConfirmed) {
            try {
                await deleteAbsence(id);
                console.log('Success delete absence data');
                await showSuccessAlert('Berhasil', 'Data absensi berhasil dihapus');
                await fetchAbsence();
            } catch (error) {
                console.error('Error deleting absence:', error);
                await showErrorAlert('Error', 'Gagal menghapus data absensi');
            }
        }
    };

    // Handle image click
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    // Format tanggal
    const formatDate = (date: string) => {
        return format(new Date(date), 'dd MMMM yyyy', { locale: id });
    };

    const handleExportPDF = () => {
        try {
            const doc = generateAbsenceReport(filteredData);
            doc.save('laporan-absensi-siswa.pdf');
            setDropdownOpen(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            showErrorAlert('Error', 'Gagal menghasilkan PDF');
        }
    };


    // Filter dan pagination
    const filteredData = absence.filter(item =>
        item.Student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Student?.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Absensi Siswa</h1>
                    <p className="text-sm text-gray-600">Halo {user?.username}, selamat datang kembali</p>
                </div>


                {/* search */}
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
                                            onClick={handleExportPDF}
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
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Keterangan</th>
                                    <th className="py-2 px-4 border-b text-left">Bukti Surat</th>
                                    <th className="py-2 px-4 border-b text-left">Titik Koordinat</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.Student?.name}</td> 
                                        <td className="py-2 px-4 border-b">{item.Student?.class.name}</td> 
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.status === AbsenceStatus.Present
                                                ? 'bg-[#0a97b028] text-[var(--third-color)]'
                                                : item.status === AbsenceStatus.Sick
                                                    ? 'bg-[#e88e1f29] text-[var(--second-color)]'
                                                    : item.status === AbsenceStatus.Alpha
                                                        ? 'bg-[#bd000025] text-[var(--fourth-color)]'
                                                        : item.status === AbsenceStatus.Permission
                                                            ? 'bg-[#1f509a26] text-[var(--main-color)]'
                                                            : item.status === AbsenceStatus.Late
                                                                ? 'bg-[#0a97b028] text-[var(--third-color)]'
                                                                : 'bg-[#0a97b028] text-[var(--third-color)]'
                                                }`}>
                                                {getAbsenceStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {item.photo ? (
                                                <div
                                                    className="w-16 h-16 overflow-hidden rounded cursor-pointer"
                                                    onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_API_URL}/uploads/absence/${item.photo?.split('/').pop()}`)}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/absence/${item.photo.split('/').pop()}`}
                                                        alt="Bukti Surat"
                                                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                                        width={256}
                                                        height={256}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {item.latitude && item.longitude ?
                                                `${item.latitude}, ${item.longitude}` :
                                                <span className="text-gray-400">-</span>
                                            }
                                        </td>
                                        <td className="py-2 px-4 border-b">{formatDate(item.date)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleDelete(item.id!)}
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
                        {/* Image Modal */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                                onClick={handleCloseImage}
                            >
                                <div className="relative max-w-4xl max-h-[90vh] w-full">
                                    <button
                                        onClick={handleCloseImage}
                                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
                                    >
                                        <i className="bx bx-x text-2xl"></i>
                                    </button>
                                    <Image
                                        src={selectedImage}
                                        alt="Bukti Surat"
                                        className="w-full h-auto object-contain rounded-lg"
                                        width={1024}
                                        height={1024}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}
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
        </div>
    );
}