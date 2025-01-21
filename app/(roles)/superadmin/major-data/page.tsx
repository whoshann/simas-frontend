"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useMajors } from '@/app/hooks/useMajorData';

interface FormData {
    [key: string]: any;
}

interface MajorForm {
    id?: number;
    name: string;
    code: string;
}

export default function MajorPage() {
    const {
        majors,
        loading: majorsLoading,
        error,
        fetchMajors,
        createMajor,
        updateMajor,
        deleteMajor
    } = useMajors();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState<MajorForm | null>(null);

    const headers = [
        { key: "no", label: "No" },
        { key: "majorName", label: "Nama Jurusan" },
        { key: "majorCode", label: "Kode Jurusan" },
    ];

    const pageContent = {
        title: "Data Jurusan",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    const majorFields = [
        { name: 'name', label: 'Nama Jurusan', type: 'text' as const, required: true },
        { name: 'code', label: 'Kode Jurusan', type: 'text' as const, required: true },
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                await fetchMajors();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleEdit = (id: number) => {
        const major = majors.find(m => m.id === id);
        if (major) {
            setSelectedMajor({
                id: major.id,
                name: major.name,
                code: major.code
            });
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (data: FormData) => {
        try {
            const majorData = {
                name: String(data.name).trim(),
                code: String(data.code).trim()
            };

            if (selectedMajor?.id) {
                await updateMajor(selectedMajor.id, majorData);
                alert('Data jurusan berhasil diperbarui!');
            } else {
                await createMajor(majorData);
                alert('Data jurusan berhasil ditambahkan!');
            }

            await fetchMajors();
            setIsModalOpen(false);
            setSelectedMajor(null);
        } catch (error: any) {
            console.error("Error submitting data:", error);
            alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMajor(id);
        } catch (error) {
            console.error("Error deleting major:", error);
        }
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log("Exporting to PDF...");
        } else {
            console.log("Exporting to Excel...");
        }
    };

    if (loading || majorsLoading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title={pageContent.title}
                greeting={pageContent.greeting}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={headers}
                data={majors.map((major, index) => ({
                    no: index + 1,
                    majorName: major.name,
                    majorCode: major.code,
                    id: major.id
                }))}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedMajor(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMajor(null);
                }}
                onSubmit={handleSubmit}
                title={selectedMajor ? "Edit Data Jurusan" : "Tambah Data Jurusan"}
                fields={majorFields}
                initialData={selectedMajor ? {
                    name: selectedMajor.name,
                    code: selectedMajor.code
                } : undefined}
                width="w-[40rem]"
            />
        </div>
    );
}