"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import TableData2 from "@/app/components/StudentDispenseTable/TableData2";
import { DispenseStatus } from '@/app/utils/enums';


// Fungsi untuk mengunduh PDF
const handleDownloadPDF = async (data: any) => {
    try {
        // Mengambil file PDF dari folder public
        const response = await fetch('/images/contoh-surat.pdf');
        const blob = await response.blob();

        // Generate nama file yang unik berdasarkan data siswa
        const fileName = `surat_dispensasi_${data.date.replace(/-/g, '')}_${data.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;

        // Buat link untuk download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Gagal mengunduh surat. Silakan coba lagi nanti.');
    }
};


// Data statis untuk tabel
const staticDispensationData = [
    {
        id: 1,
        name: "Adam Smith",
        class: "XII RPL 1",
        reason: "Mengikuti lomba pencak silat",
        startTime: "08:00",
        endTime: "14:00",
        date: "2024-01-15",
        status: DispenseStatus.Pending
    },
    {
        id: 2,
        name: "Adam Smith",
        class: "XII RPL 1",
        reason: "Sakit gigi",
        startTime: "10:00",
        endTime: "12:00",
        date: "2024-01-10",
        status: DispenseStatus.Approved
    },
    {
        id: 3,
        name: "Adam Smith",
        class: "XII RPL 1",
        reason: "Urusan keluarga",
        startTime: "13:00",
        endTime: "15:00",
        date: "2024-01-05",
        status: DispenseStatus.Rejected
    }
];

const tableHeaders = [
    { key: 'name', label: 'Nama' },
    { key: 'class', label: 'Kelas' },
    { key: 'reason', label: 'Alasan' },
    { key: 'startTime', label: 'Jam Keluar' },
    { key: 'endTime', label: 'Jam Kembali' },
    { key: 'date', label: 'Tanggal' },
    {
        key: 'status',
        label: 'Status',
        render: (value: DispenseStatus, row: any) => {
            const statusStyles = {
                [DispenseStatus.Pending]: 'bg-[#e88e1f29] text-[var(--second-color)]',
                [DispenseStatus.Approved]: 'bg-[#0a97b022] text-[var(--third-color)]',
                [DispenseStatus.Rejected]: 'bg-red-100 text-[var(--fourth-color)]',
            };

            // Jika status Approved, tampilkan tombol Unduh
            if (value === DispenseStatus.Approved) {
                return (
                    <button
                        onClick={() => handleDownloadPDF(row)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusStyles[value]}`}
                    >
                        <i className='bx bx-download'></i>
                        Unduh Surat
                    </button>
                );
            }

            // Untuk status lainnya, tampilkan seperti biasa
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[value]}`}>
                    {value}
                </span>
            );
        }
    }
];

export default function StudentDispensePage() {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student", "SuperAdmin"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Surat Dispen</h1>
                <p className="text-sm text-gray-600">Halo adam, selamat datang di halaman Surat Dispen</p>
            </header>

            <main className="px-9 pb-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
                            <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
                            <span className="ml-2">Form Pengajuan Dispen</span>
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Masukkan Alasan Dispen
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    // value=""
                                    // onChange=""
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-none"
                                    rows={3}
                                    required
                                    placeholder='Ingin mengikuti lomba pencak silat'
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="startTime"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Jam Keluar
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endTime"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Jam Kembali
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="dateTime"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Masukkan Tanggal
                                </label>
                                <input
                                    type="date"
                                    id="dateTime"
                                    name="dateTime"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                    {/* Tabel Riwayat */}
                    <TableData2
                        headers={tableHeaders}
                        data={staticDispensationData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />
                </div>
            </main>
        </div>
    );
}
