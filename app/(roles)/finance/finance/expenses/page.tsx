"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";

export default function ExpensesPage() {
    // Fetch data saat komponen dimount
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

    const [selectedExpenses, setSelectedExpenses] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = [
        { id: 1, no: 1, name: "Perbaikan Meja", quantity: 600000, rabId: 101, date: "2024-12-15" },
        { id: 2, no: 2, name: "Perbaikan AC", quantity: 360000, rabId: 102, date: "2024-12-15" },
        { id: 3, no: 3, name: "ATK Ruang Guru", quantity: 100000, rabId: 103, date: "2024-12-15" },
        { id: 4, no: 4, name: "Perbaikan Ruang 7", quantity: 1800000, rabId: 104, date: "2024-12-15" },
        { id: 5, no: 5, name: "Perbaikan Toilet", quantity: 1000000, rabId: 105, date: "2024-12-15" },
    ];

    const headers = [
        { key: 'no', label: 'No' },
        { key: 'name', label: 'Keterangan' },
        {
            key: 'quantity',
            label: 'Jumlah',
            render: (value: number) => `Rp. ${value.toLocaleString()}`
        },
        {
            key: 'rabId',
            label: 'RAB ID',
            render: (value: number) => value.toString().padStart(3, '0')
        },
        {
            key: 'date',
            label: 'Tanggal',
            render: (value: string) => new Date(value).toLocaleDateString('id-ID')
        }
    ];

    const modalFields = [
        { name: 'name', label: 'Keterangan', type: 'text' as const, required: true },
        { name: 'quantity', label: 'Jumlah', type: 'number' as const, required: true },
        { name: 'rabId', label: 'RAB ID', type: 'number' as const, required: true },
        { name: 'date', label: 'Tanggal', type: 'date' as const, required: true }
    ];

    const handleAdd = () => {
        setSelectedExpenses(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const expense = data.find(item => item.id === id);
        setSelectedExpenses(expense);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete item with id:", id);
        // Implementasi delete
    };

    const handleModalSubmit = async (formData: any) => {
        if (selectedExpenses) {
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
        <div className="flex-1 flex flex-col px-9 overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Data Pengeluaran"
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
                title={selectedExpenses ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
                fields={modalFields}
                initialData={selectedExpenses}
            />
        </div>
    );
}