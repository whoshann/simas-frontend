"use client";
import "@/app/styles/globals.css";
import React, { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import DataTable from "@/app/components/DataTable/TableData";
import PageHeader from "@/app/components/DataTable/TableHeader";

// Enum untuk status
enum DispensationStatus {
    Pending = 'Menunggu',
    Approved = 'Disetujui',
    Rejected = 'Ditolak'
}

// Interface untuk data dispensasi
interface DispensationData {
    no: number;
    id: number;
    name: string;
    class: string;
    reason: string;
    startTime: string;
    endTime: string;
    date: string;
    status: DispensationStatus;
}

// Data dummy
const staticDispensationData: DispensationData[] = [
    {
        no: 1,
        id: 1,
        name: "John Doe",
        class: "XII RPL 1",
        reason: "Mengikuti lomba programming",
        startTime: "08:00",
        endTime: "14:00",
        date: "2024-01-15",
        status: DispensationStatus.Pending
    },
    {
        no: 2,
        id: 2,
        name: "Jane Smith",
        class: "XII RPL 2",
        reason: "Sakit gigi",
        startTime: "10:00",
        endTime: "12:00",
        date: "2024-01-15",
        status: DispensationStatus.Approved
    },
    {
        no: 3,
        id: 3,
        name: "Mike Johnson",
        class: "XII RPL 1",
        reason: "Urusan keluarga",
        startTime: "13:00",
        endTime: "15:00",
        date: "2024-01-15",
        status: DispensationStatus.Rejected
    },
    {
        no: 4,
        id: 4,
        name: "John Doe",
        class: "XII RPL 1",
        reason: "Mengikuti lomba programming",
        startTime: "08:00",
        endTime: "14:00",
        date: "2024-01-15",
        status: DispensationStatus.Pending
    },
    {
        no: 5,
        id: 5,
        name: "Jane Smith",
        class: "XII RPL 2",
        reason: "Sakit gigi",
        startTime: "10:00",
        endTime: "12:00",
        date: "2024-01-15",
        status: DispensationStatus.Approved
    },
    {
        no: 6,
        id: 6,
        name: "Mike Johnson",
        class: "XII RPL 1",
        reason: "Urusan keluarga",
        startTime: "13:00",
        endTime: "15:00",
        date: "2024-01-15",
        status: DispensationStatus.Rejected
    },
];

export default function StudentAffairsDispensationPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [dispensationData, setDispensationData] = useState<DispensationData[]>(staticDispensationData);

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log('Exporting to PDF...');
            // Implementasi export PDF
        } else {
            console.log('Exporting to Excel...');
            // Implementasi export Excel
        }
    };

    // Fungsi untuk handle konfirmasi
    const handleConfirm = (id: number) => {
        setDispensationData(prevData =>
            prevData.map(item =>
                item.id === id
                    ? { ...item, status: DispensationStatus.Approved }
                    : item
            )
        );
    };

    // Fungsi untuk handle penolakan
    const handleReject = (id: number) => {
        setDispensationData(prevData =>
            prevData.map(item =>
                item.id === id
                    ? { ...item, status: DispensationStatus.Rejected }
                    : item
            )
        );
    };

    // Konfigurasi header tabel
    const tableHeaders = [
        { key: 'no', label: 'No' },
        { key: 'name', label: 'Nama' },
        { key: 'class', label: 'Kelas' },
        { key: 'reason', label: 'Alasan' },
        { key: 'startTime', label: 'Jam Keluar' },
        { key: 'endTime', label: 'Jam Kembali' },
        { key: 'date', label: 'Tanggal' },
        {
            key: 'status',
            label: 'Status',
            render: (value: DispensationStatus) => {
                const statusStyles = {
                    [DispensationStatus.Pending]: 'bg-[#e88e1f29] text-[var(--second-color)]',
                    [DispensationStatus.Approved]: 'bg-[#0a97b022] text-[var(--third-color)]',
                    [DispensationStatus.Rejected]: 'bg-red-100 text-[var(--fourth-color)]',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[value]}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_: any, row: DispensationData) => {
                if (row.status === DispensationStatus.Pending) {
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleConfirm(row.id)}
                                className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                            >
                                <i className='bx bxs-check-circle text-lg'></i>
                            </button>
                            <button
                                onClick={() => handleReject(row.id)}
                                className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                            >
                                <i className='bx bxs-x-circle text-lg'></i>
                            </button>
                        </div>
                    );
                }
                return (
                    <span className="text-gray-400 text-xs">
                        -
                    </span>
                );
            }
        }
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
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

    if (!isAuthorized) {
        return <div>Anda tidak memiliki akses ke halaman ini</div>;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Dispensasi Siswa"
                greeting="Selamat datang di halaman Dispensasi Siswa"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={tableHeaders}
                data={dispensationData}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onExport={handleExport}
            />
        </div>
    );
}