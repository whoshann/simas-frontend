"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MonthlyFinancePage() {
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
    const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);

    const data = [
        { id: 1, date: "Januari 20205", expenses: 600000, income: 1000000, remainingBalance: 400000 },
        { id: 2, date: "Februari 2025", expenses: 360000, income: 800000, remainingBalance: 440000 },
        { id: 3, date: "Maret 2025", expenses: 100000, income: 500000, remainingBalance: 400000 },
        { id: 4, date: "April 2025", expenses: 1800000, income: 2000000, remainingBalance: 200000 },
        { id: 5, date: "Mei 2025", expenses: 1000000, income: 1500000, remainingBalance: 500000 },
    ];

    const headers = [
        { key: 'id', label: 'No' },
        { key: 'date', label: 'Bulan dan Tahun', render: (value: number) => value },
        { key: 'expenses', label: 'Pengeluaran', render: (value: number) => `Rp. ${value.toLocaleString()}` },
        { key: 'income', label: 'Pemasukan', render: (value: number) => `Rp. ${value.toLocaleString()}` },
        { key: 'remainingBalance', label: 'Sisa Saldo', render: (value: number) => `Rp. ${value.toLocaleString()}` },
    ];

    const modalFields = [
        { 
            name: 'date', 
            label: 'Bulan dan Tahun', 
            type: 'date' as const, 
            required: true,
            dateFormat: 'MM/yyyy',
            showMonthYearPicker: true,
            placeholder: 'mm/yyyy'
        },
        { name: 'expenses', label: 'Pengeluaran', type: 'number' as const, required: true },
        { name: 'income', label: 'Pemasukan', type: 'number' as const, required: true },
        { name: 'remainingBalance', label: 'Sisa Saldo', type: 'number' as const, required: true }
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
        const datePattern = /^(0[1-9]|1[0-2])\/\d{4}$/; // Format mm/yyyy
        if (!datePattern.test(formData.date)) {
            console.error("Format tanggal tidak valid. Harus mm/yyyy");
            return;
        }

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
        return <div>
            Hello world
        </div>;
    }

    return (
        <div className="flex-1 flex flex-col px-9 overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Data Keuangan Bulanan"
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
                title={selectedExpenses ? "Edit Keuangan Bulanan" : "Tambah Keuangan Bulanan"}
                fields={modalFields}
                initialData={selectedExpenses}
            >
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="mm/yyyy"
                    filterDate={(date) => date.getDate() === 1}
                />
            </DynamicModal>
        </div>
    );
}