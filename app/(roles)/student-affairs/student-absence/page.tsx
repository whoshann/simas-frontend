"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { authApi } from "@/app/api/auth";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import DataTable from "@/app/components/DataTable/TableData";
import PageHeader from "@/app/components/DataTable/TableHeader";

interface User {
    id: number;
    name: string;
    username: string;
}

interface AbsenceData {
    id: number;
    name: string;
    class: string;
    status: string;
    document: string | null;
    date: string;
}

interface FormData {
    name: string;
    class: string;
    status: string;
    date: string;
    document?: File;
}

export default function StudentAffairsAbsencePage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        username: '',
    });

    // Data statis untuk tabel
    const absenceData: AbsenceData[] = [
        {
            id: 1,
            name: "Ilham Kurniawan",
            class: "X PH A",
            status: "Hadir",
            document: "/images/Berita1.jpg",
            date: "21/01/2024"
        },
        {
            id: 2,
            name: "Adi Kurniawan",
            class: "X PH B",
            status: "Sakit",
            document: "/images/Berita1.jpg",
            date: "22/01/2024"
        },
        {
            id: 3,
            name: "Imam Kurniawan",
            class: "XI IPA A",
            status: "Alpha",
            document: null,
            date: "23/01/2024"
        },
        {
            id: 4,
            name: "Rizki Kurniawan",
            class: "XI IPA B",
            status: "Izin",
            document: "/images/Berita1.jpg",
            date: "24/01/2024"
        }
    ];

    // Konfigurasi header tabel
    const tableHeaders = [
        { key: 'id', label: 'No' },
        { key: 'name', label: 'Nama' },
        { key: 'class', label: 'Kelas' },
        { 
            key: 'status', 
            label: 'Keterangan',
            render: (value: string) => (
                <span className={`inline-block px-3 py-1 rounded-full ${
                    value === 'Hadir' ? 'bg-[#0a97b028] text-[var(--third-color)]' : 
                    value === 'Sakit' ? 'bg-[#e88e1f29] text-[var(--second-color)]' : 
                    value === 'Alpha' ? 'bg-[#bd000025] text-[var(--fourth-color)]' : 
                    'bg-[#1f509a26] text-[var(--main-color)]'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            key: 'document', 
            label: 'Bukti Surat',
            render: (value: string | null) => (
                value ? (
                    <div className="w-16 h-16 overflow-hidden rounded">
                        <img
                            src={value}
                            alt="Bukti Surat"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <span>-</span>
                )
            )
        },
        { key: 'date', label: 'Tanggal' }
    ];

    // Konfigurasi fields untuk modal
    const modalFields = [
        {
            name: "name",
            label: "Nama Siswa",
            type: "text" as const,
            required: true,
            colSpan: 2,
            placeholder: "Masukkan nama siswa"
        },
        {
            name: "class",
            label: "Kelas",
            type: "select" as const,
            required: true,
            options: [
                { value: "X PH A", label: "X PH A" },
                { value: "X PH B", label: "X PH B" },
                { value: "XI IPA A", label: "XI IPA A" },
                { value: "XI IPA B", label: "XI IPA B" }
            ]
        },
        {
            name: "status",
            label: "Keterangan",
            type: "select" as const,
            required: true,
            options: [
                { value: "Hadir", label: "Hadir" },
                { value: "Sakit", label: "Sakit" },
                { value: "Alpha", label: "Alpha" },
                { value: "Izin", label: "Izin" }
            ]
        },
        {
            name: "date",
            label: "Tanggal",
            type: "date" as const,
            required: true
        },
        {
            name: "document",
            label: "Bukti Surat",
            type: "file" as const,
            accept: "image/*",
            colSpan: 2
        }
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                setIsAuthorized(true);
                
                const userId = getUserIdFromToken();
                if (userId) {
                    await fetchUserData(Number(userId));
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                setError("Terjadi kesalahan saat memuat halaman");
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const fetchUserData = async (userId: number) => {
        try {
            const response = await authApi.getUserLogin(userId);
            setUser(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Gagal memuat data pengguna");
        }
    };

    const handleImport = () => {
        console.log("Import button clicked");
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        console.log(`Export ${type} clicked`);
    };

    const handleEdit = (id: number) => {
        console.log(`Edit item with id: ${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Delete item with id: ${id}`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden px-9 bg-[#F2F2F2]">
            <PageHeader
                title="Absensi Siswa"
                greeting={`Halo ${user.name || 'Admin Kesiswaan'}, selamat datang kembali`}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={tableHeaders}
                data={absenceData}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onImport={handleImport}
                onExport={handleExport}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}