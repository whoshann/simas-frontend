"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";

type Spp = {
    id: number;
    no: number;
    name: string;
    quantity: number;
    month: number;
    status: "Lunas" | "Belum Dibayar";
    transactionId: string;
    date: string;
};

export default function SppPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpp, setSelectedSpp] = useState<Spp | null>(null);

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance", "SuperAdmin"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const data: Spp[] = [
        { id: 1, no: 1, name: "Revina Okta Safitri", quantity: 100000, month: 1, status: "Belum Dibayar", transactionId: "TXN-12345", date: "2024-12-15" },
        { id: 2, no: 2, name: "Putri Rosario", quantity: 100000, month: 1, status: "Lunas", transactionId: "TXN-12346", date: "2024-12-15" },
        { id: 3, no: 3, name: "Aurizta Widya Ulima", quantity: 100000, month: 1, status: "Belum Dibayar", transactionId: "TXN-12347", date: "2024-12-15" },
        { id: 4, no: 4, name: "Davina Tegar Putri", quantity: 100000, month: 1, status: "Lunas", transactionId: "TXN-12348", date: "2024-12-15" },
        { id: 5, no: 5, name: "Ikfi Dwi Nazila", quantity: 100000, month: 1, status: "Lunas", transactionId: "TXN-12349", date: "2024-12-15" },
    ];

    const headers = [
        { key: 'no', label: 'No' },
        { key: 'name', label: 'Nama Siswa' },
        { 
            key: 'quantity', 
            label: 'Jumlah',
            render: (value: number) => `Rp. ${value.toLocaleString()}`
        },
        { 
            key: 'month', 
            label: 'Bulan',
            render: (value: number) => {
                const months = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];
                return months[value - 1];
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => (
                <span className={`px-3 py-1 rounded-full text-xs ${
                    value === "Lunas" 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                }`}>
                    {value}
                </span>
            )
        },
        { key: 'transactionId', label: 'ID Transaksi' },
        { 
            key: 'date', 
            label: 'Tanggal',
            render: (value: string) => new Date(value).toLocaleDateString('id-ID')
        }
    ];

    const modalFields = [
        { name: 'name', label: 'Nama Siswa', type: 'text' as const, required: true },
        { name: 'quantity', label: 'Jumlah', type: 'number' as const, required: true },
        { 
            name: 'month', 
            label: 'Bulan', 
            type: 'select' as const, 
            required: true,
            options: Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1),
                label: `Bulan ${i + 1}`
            }))
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Lunas', label: 'Lunas' },
                { value: 'Belum Dibayar', label: 'Belum Dibayar' }
            ]
        },
        { name: 'transactionId', label: 'ID Transaksi', type: 'text' as const, required: true },
        { name: 'date', label: 'Tanggal', type: 'date' as const, required: true }
    ];

    const handleAdd = () => {
        setSelectedSpp(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const expense = data.find(item => item.id === id);
        setSelectedSpp(expense);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete item with id:", id);
        // Implementasi delete
    };

    const handleModalSubmit = async (formData: any) => {
        if (selectedSpp) {
            console.log("Update data:", formData);
        } else {
            console.log("Add new data:", formData);
        }
        setIsModalOpen(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return <div className="p-4">Anda tidak memiliki akses ke halaman ini.</div>;
    }

    return (
        <div className="flex-1 px-9 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Pembayaran SPP"
                greeting="Halo role Keuangan, selamat datang kembali"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={headers}
                data={data}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onImport={() => console.log("Import clicked")}
                onExport={(type) => console.log("Export", type)}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                title={selectedSpp ? "Edit Data SPP" : "Tambah Data SPP"}
                fields={modalFields}
                initialData={selectedSpp}
            />
        </div>
    );
}