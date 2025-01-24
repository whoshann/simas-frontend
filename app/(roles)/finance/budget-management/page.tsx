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
interface BudgetProposal {
    no: number;
    id: number;
    name: string;
    role: string;
    title: string;
    description: string;
    amount: number;
    document: string;
    date: string;
    status: DispensationStatus;
}

// Data dummy
const staticBudgetProposal: BudgetProposal[] = [
    {
        no: 1,
        id: 1,
        name: "John Doe",
        role: "Kesiswaan",
        title: "Renovation of Computer Lab",
        amount: 20000000,
        description: "Repair of lab facilities",
        document: "Proposal_Renovation_Lab.pdf",
        date: "15/12/2024",
        status: DispensationStatus.Pending,
    },
    {
        no: 2,
        id: 2,
        name: "John Doe",
        role: "Kesiswaan",
        title: "Sports Equipment",
        amount: 5000000,
        description: "Procurement of balls and nets",
        document: "Proposal_Sports.pdf",
        date: "15/12/2024",
        status: DispensationStatus.Pending,
    },
    {
        no: 3,
        id: 3,
        name: "John Doe",
        role: "Kesiswaan",
        title: "Student Workshop",
        amount: 15000000,
        description: "Robotics training for students",
        document: "Proposal_Workshop.pdf",
        date: "15/12/2024",
        status: DispensationStatus.Pending,
    },
    {
        no: 4,
        id: 4,
        name: "John Doe",
        role: "Sarpras",
        title: "Book Procurement",
        amount: 3000000,
        description: "Library reference books",
        document: "Proposal_Books.pdf",
        date: "15/12/2024",
        status: DispensationStatus.Approved,
    },
    {
        no: 5,
        id: 5,
        name: "John Doe",
        role: "Guru",
        title: "Building Maintenance",
        amount: 10000000,
        description: "Repair of classroom ceiling",
        document: "Proposal_Maintenance.pdf",
        date: "15/12/2024",
        status: DispensationStatus.Rejected,
    }
];

export default function FinanceDispensationPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [budgetProposal, setBudgetProposal] = useState<BudgetProposal[]>(staticBudgetProposal);

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance","SuperAdmin"]);
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
        setBudgetProposal(prevData =>
            prevData.map(item =>
                item.id === id
                    ? { ...item, status: DispensationStatus.Approved }
                    : item
            )
        );
    };

    // Fungsi untuk handle penolakan
    const handleReject = (id: number) => {
        setBudgetProposal(prevData =>
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
        { key: 'role', label: 'Peran' },
        { key: 'title', label: 'Rencana RAB' },
        { key: 'amount', label: 'Dana' },
        { key: 'description', label: 'Alasan Pengajuan' },
        { key: 'document', label: 'Dokumen Pendukung' },
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
            render: (_: any, row: BudgetProposal) => {
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

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return <div>Anda tidak memiliki akses ke halaman ini</div>;
    }

    return (
        <div className="flex-1 flex px-9 flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Data Pengajuan RAB"
                greeting="Halo admin keuangan, selamat datang di halaman Data Pengajuan RAB"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={tableHeaders}
                data={budgetProposal}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onExport={handleExport}
            />
        </div>
    );
}