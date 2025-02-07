"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useSubjects } from '@/app/hooks/useSubject';
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from '@/app/utils/sweetAlert';
import { useUser } from "@/app/hooks/useUser";

interface SubjectForm {
    id?: number;
    name: string;
    code: string;
}

export default function SubjectPage() {

    const {
        subjects,
        loading: subjectsLoading,
        fetchSubjects,
        createSubject,
        updateSubject,
        deleteSubject
    } = useSubjects();

    const { user } = useUser();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectForm | null>(null);

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log("Exporting to PDF...");
            // Implementasi export PDF
        } else {
            console.log("Exporting to Excel...");
            // Implementasi export Excel
        }
    };

    // Table headers configuration
    const headers = [
        { key: "no", label: "No" },
        { key: "name", label: "Mata Pelajaran" },
        { key: "code", label: "Kode Mapel" },
    ];

    const pageContent = {
        title: "Data Mapel",
        greeting: `Halo ${user?.username || 'User'}, selamat datang kembali`
    };

    // Form fields configuration
    const subjectFields = [

        { name: 'name', label: 'Mata Pelajaran', type: 'text' as const, required: true },
        { name: 'code', label: 'Kode Mapel', type: 'text' as const, required: true },
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                await fetchSubjects();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleEdit = (id: number) => {
        // Cari subject berdasarkan id dari data subjects
        const subject = subjects.find(s => s.id === id);
        if (subject) {
            const formattedSubject: SubjectForm = {
                id: subject.id,
                name: subject.name,
                code: subject.code
            };
            setSelectedSubject(formattedSubject);
            setIsModalOpen(true);
        }
    };

    
    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Mapel ini?',
            'Apakah Anda yakin ingin menghapus data mata pelajaran ini?'
        );

        if (isConfirmed) {
            try {
                await deleteSubject(id);
                await showSuccessAlert('Berhasil', 'Data mata pelajaran berhasil dihapus');
                await fetchSubjects();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data mata pelajaran');
            }
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            // Log data form untuk debugging
            console.log('Form Data:', formData);

            const subjectData = {
                name: formData.name.trim(),
                code: formData.code.trim()
            };

            if (selectedSubject?.id) {
                await updateSubject(selectedSubject.id, subjectData);
                await showSuccessAlert('Berhasil', 'Mata pelajaran berhasil diperbarui');
            } else {
                await createSubject(subjectData);
                await showSuccessAlert('Berhasil', 'Mata pelajaran berhasil ditambahkan');
            }

            await fetchSubjects();
            setIsModalOpen(false);
            setSelectedSubject(null);
        } catch (error: any) {
            // Tampilkan detail error lebih lengkap
            console.error("Error submitting data:", error);
            console.error("Error response:", error.response?.data);

            // Optional: Tambahkan notifikasi error untuk user
            alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };


    if (loading) return <LoadingSpinner />;

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
                data={subjects.map((subject, index) => ({
                    no: index + 1,
                    name: subject.name,
                    code: subject.code,
                    id: subject.id
                }))}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedSubject(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />


            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSubject(null);
                }}
                onSubmit={handleSubmit}
                title={selectedSubject ? "Edit Data Mapel" : "Tambah Data Mapel"}
                fields={subjectFields}
                initialData={selectedSubject ? {
                    name: selectedSubject.name,
                    code: selectedSubject.code
                } : undefined}
                width="w-[40rem]"
            />
        </div >
    );
}