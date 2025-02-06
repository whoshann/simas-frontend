"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { usePositions } from '@/app/hooks/usePositionData';
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";

interface FormData {
    [key: string]: any;
}

export default function PositionPage() {
    const {
        positions,
        loading: positionsLoading,
        error,
        fetchPositions,
        createPosition,
        updatePosition,
        deletePosition
    } = usePositions();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<FormData | null>(null);

    const headers = [
        { key: "no", label: "No" },
        { key: "position", label: "Posisi Jabatan" },
        { key: "name", label: "Nama Posisi Jabatan" },
    ];

    const pageContent = {
        title: "Data Posisi Jabatan Guru",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    const positionFields = [
        { name: 'position', label: 'Posisi', type: 'text' as const, required: true },
        { name: 'name', label: 'Nama Posisi', type: 'text' as const, required: true },
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                await fetchPositions();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleEdit = (id: number) => {
        const position = positions.find(p => p.id === id);
        if (position) {
            setSelectedPosition({
                id: position.id,
                position: position.position,
                name: position.name
            });
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (data: FormData) => {
        try {
            const positionData = {
                position: String(data.position).trim(),
                name: String(data.name).trim()
            };

            if (selectedPosition?.id) {
                await updatePosition(selectedPosition.id, positionData);
                await showSuccessAlert('Berhasil', 'Data posisi jabatan berhasil di perbarui');
            } else {
                await createPosition(positionData);
                await showSuccessAlert('Berhasil', 'Data posisi jabatan berhasil di tambahkan');
            }

            await fetchPositions();
            setIsModalOpen(false);
            setSelectedPosition(null);
        } catch (error: any) {
            console.error("Error submitting data:", error);
            alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

 
    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Pelanggaran',
            'Apakah Anda yakin ingin menghapus data pelanggaran ini?'
        );

        if (isConfirmed) {
            try {
                await deletePosition(id);
                await showSuccessAlert('Berhasil', 'Data posisi jabatan berhasil dihapus');
                await fetchPositions();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data posisi jabatan');
            }
        }
    };


    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log("Exporting to PDF...");
        } else {
            console.log("Exporting to Excel...");
        }
    };

    if (loading || positionsLoading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 px-9 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title={pageContent.title}
                greeting={pageContent.greeting}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={headers}
                data={positions.map((position, index) => ({
                    no: index + 1,
                    position: position.position,
                    name: position.name,
                    id: position.id
                }))}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedPosition(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPosition(null);
                }}
                onSubmit={handleSubmit}
                title={selectedPosition ? "Edit Data Posisi" : "Tambah Data Posisi"}
                fields={positionFields}
                initialData={selectedPosition ? {
                    position: selectedPosition.position,
                    name: selectedPosition.name
                } : undefined}
                width="w-[40rem]"
            />
        </div>
    );
}