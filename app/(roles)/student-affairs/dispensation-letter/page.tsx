"use client";

import React, { useEffect, useState } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useDispense } from "@/app/hooks/useDispense";
import { DispenseStatus } from "@/app/utils/enums";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getDispenseStatusLabel } from "@/app/utils/enumHelpers";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";

export default function StudentAffairsDispensationPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const {
        dispenses,
        loading,
        fetchDispenses,
        approveDispense,
        rejectDispense
    } = useDispense();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                await fetchDispenses();
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    },[]);

    const handleConfirm = async (id: number) => {
        try {
            const isConfirmed = await showConfirmDelete(
                'Konfirmasi Dispensasi',
                'Apakah Anda yakin ingin menyetujui dispensasi ini?'
            );

            if (isConfirmed) {
                await approveDispense(id);
                await showSuccessAlert('Berhasil', 'Dispensasi berhasil disetujui');
                await fetchDispenses(); // Refresh data setelah update
            }
        } catch (error) {
            console.error('Error approving dispense:', error);
            await showErrorAlert('Error', 'Gagal menyetujui dispensasi');
        }
    };

    const handleReject = async (id: number) => {
        try {
            const isConfirmed = await showConfirmDelete(
                'Tolak Dispensasi',
                'Apakah Anda yakin ingin menolak dispensasi ini?'
            );

            if (isConfirmed) {
                await rejectDispense(id);
                await showSuccessAlert('Berhasil', 'Dispensasi berhasil ditolak');
                await fetchDispenses(); // Refresh data setelah update
            }
        } catch (error) {
            console.error('Error rejecting dispense:', error);
            await showErrorAlert('Error', 'Gagal menolak dispensasi');
        }
    };



    // Filtering logic
    const filteredData = dispenses.filter(item =>
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.endTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    if (!isAuthorized) {
        return null;
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Dispensasi Siswa</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
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
                    <div className="mb-4">
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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Siswa</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Alasan</th>
                                    <th className="py-2 px-4 border-b text-left">Jam Keluar</th>
                                    <th className="py-2 px-4 border-b text-left">Jam Kembali</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                            <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                            <td className="py-2 px-4 border-b">{item.student?.name || '-'}</td>
                                            <td className="py-2 px-4 border-b">
                                                {item.student?.class?.name || '-'}
                                            </td>
                                            <td className="py-2 px-4 border-b">{item.reason}</td>
                                            <td className="py-2 px-4 border-b">
                                                {format(new Date(item.startTime), 'HH:mm', { locale: id })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {format(new Date(item.endTime), 'HH:mm', { locale: id })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {format(new Date(item.date), 'dd MMMM yyyy', { locale: id })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.status === DispenseStatus.Pending ? 'bg-[#e88e1f29] text-[var(--second-color)]' :
                                                    item.status === DispenseStatus.Approved ? 'bg-[#1f509a26] text-[var(--main-color)]' :
                                                        'bg-[#bd000025] text-[var(--fourth-color)]'
                                                    }`}>
                                                    {getDispenseStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {item.status === DispenseStatus.Pending && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleConfirm(item.id)}
                                                            className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                        >
                                                            <i className='bx bxs-check-circle text-lg'></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id)}
                                                            className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                                        >
                                                            <i className='bx bxs-x-circle text-lg'></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
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