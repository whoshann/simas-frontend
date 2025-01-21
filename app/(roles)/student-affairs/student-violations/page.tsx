"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/superadmin/DataTable/TableHeader";
import DataTable from "@/app/components/superadmin/DataTable/TableData";
import DynamicModal from "@/app/components/superadmin/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { studentsviolationsApi } from "@/app/api/students-violations";
import { StudentViolations } from "@/app/api/students-violations/types";

interface FormData {
    [key: string]: any;
}

export default function StudentViolationPage() {
    // State declarations
    const [studentsviolations, setStudentsViolations] = useState<StudentViolations[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentViolations, setSelectedStudentViolations] = useState<StudentViolations | null>(null);

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log("Exporting to PDF...");
        } else {
            console.log("Exporting to Excel...");
        }
    };

    // Table headers configuration
    const headers = [
        { key: "id", label: "No" },
        { key: "name", label: "Nama" },
        { key: "classSchool", label: "Kelas" },
        { key: "violation", label: "JPelanggaran" },
        { key: "category", label: "Kategori" },
        { key: "punishment", label: "Hukuman" },
        { key: "photo", label: "Bukti Foto" },
        { key: "date", label: "Tanggal" },
    ];

    // Page content configuration
    const pageContent = {
        title: "Pelanggaran Siswa",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    // Form fields configuration
    const studentviolationsFields = [
        { name: 'name', label: 'Nama Lengkap', type: 'text' as const, required: true },
        {
            name: 'classSchool',
            label: 'Kelas',
            type: 'select' as const,
            required: true,
            options: [
                { value: '10', label: '10' },
                { value: '11', label: '11' },
                { value: '12', label: '12' }
            ]
        },
        { 
            name: 'violation', 
            label: 'Jenis Pelanggaran', 
            type: 'text' as const, 
            required: true 
        },
        {
            name: 'category',
            label: 'Kategori',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Ringan', label: 'Ringan' },
                { value: 'Sedang', label: 'Sedang' },
                { value: 'Berat', label: 'Berat' }
            ]
        },
        { 
            name: 'punishment', 
            label: 'Hukuman', 
            type: 'textarea' as const, 
            required: true 
        },
        { 
            name: 'photo', 
            label: 'Bukti Foto', 
            type: 'file' as const, 
            required: true,
            accept: 'image/*'
        },
        { 
            name: 'date', 
            label: 'Tanggal', 
            type: 'date' as const, 
            required: true 
        }
    ];

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                const response = await studentsviolationsApi.getAll();
                setStudentsViolations(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    // Handler untuk edit data
    const handleEdit = (id: number) => {
        const student = studentsviolations.find(s => s.id === id);
        setSelectedStudentViolations(student || null);
        setIsModalOpen(true);
    };

    // Handler untuk delete data
    const handleDelete = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await studentsviolationsApi.delete(id);
                setStudentsViolations(studentsviolations.filter(student => student.id !== id));
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    // Handler untuk submit form (add/edit)
    const handleSubmit = async (formData: FormData): Promise<void> => {
        try {
            const studentViolationsData = {
                name: formData.name,
                classSchool: formData.classSchool,
                violation: formData.violation,
                category: formData.category,
                punishment: formData.punishment,
                photo: formData.photo,
                date: formData.date,
                
            };

            if (selectedStudentViolations) {
                // Update existing student
                const response = await studentsviolationsApi.update(selectedStudentViolations.id!, studentViolationsData);
                setStudentsViolations(studentsviolations.map(studentviolations => 
                    studentviolations.id === selectedStudentViolations.id ? response.data : studentviolations
                ));
            } else {
                // Add new student
                const response = await studentsviolationsApi.create(studentViolationsData);
                setStudentsViolations([...studentsviolations, response.data]);
            }
            setIsModalOpen(false);
            setSelectedStudentViolations(null);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    if (loading) return <LoadingSpinner />;

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
                data={studentsviolations}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedStudentViolations(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudentViolations(null);
                }}
                onSubmit={handleSubmit}
                title={selectedStudentViolations ? "Edit Data Siswa" : "Tambah Data Siswa"}
                fields={studentviolationsFields}
                initialData={selectedStudentViolations || undefined}
                width="w-[40rem]"
            />
        </div>
    );
}