"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/superadmin/DataTable/TableHeader";
import DataTable from "@/app/components/superadmin/DataTable/TableData";
import DynamicModal from "@/app/components/superadmin/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { studentsApi } from "@/app/api/student-data";
import { Student } from "@/app/api/student-data/types";

interface FormData {
    [key: string]: any;
}

export default function StudentPage() {
    // State declarations
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
        { key: "nis", label: "NIS" },
        { key: "classSchool", label: "Kelas" },
        { key: "major", label: "Jurusan" },
        { key: "nisn", label: "NISN" },
        { key: "gender", label: "Jenis Kelamin" },
        { key: "birthDate", label: "Tanggal Lahir" },
        { key: "birthPlace", label: "Tempat Lahir" },
        { key: "address", label: "Alamat" },
        { key: "phone", label: "Nomor" },
        { key: "parentPhone", label: "Nomor Orang Tua" },
        { key: "religion", label: "Agama" },
        { key: "motherName", label: "Nama Ibu" },
        { key: "fatherName", label: "Nama Ayah" },
        { key: "guardian", label: "Nama Wali" }
    ];

    // Page content configuration
    const pageContent = {
        title: "Data Siswa",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    // Form fields configuration
    const studentFields = [
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
            name: 'major',
            label: 'Jurusan',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'RPL', label: 'RPL' },
                { value: 'TKJ', label: 'TKJ' },
                { value: 'ANIMASI', label: 'ANIMASI' },
                { value: 'PH', label: 'PH' }
            ]
        },
        { name: 'nis', label: 'NIS', type: 'text' as const, required: true },
        { name: 'nisn', label: 'NISN', type: 'text' as const, required: true },
        {
            name: 'gender',
            label: 'Jenis Kelamin',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ]
        },
        { name: 'birthDate', label: 'Tanggal Lahir', type: 'date' as const, required: true },
        { name: 'birthPlace', label: 'Tempat Lahir', type: 'text' as const, required: true },
        { name: 'address', label: 'Alamat', type: 'textarea' as const, required: true, colSpan: 2 },
        { name: 'phone', label: 'Nomor Telepon', type: 'tel' as const, required: true },
        { name: 'parentPhone', label: 'Nomor Telepon Orang Tua', type: 'tel' as const, required: true },
        {
            name: 'religion',
            label: 'Agama',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Islam', label: 'Islam' },
                { value: 'Kristen', label: 'Kristen' },
                { value: 'Katolik', label: 'Katolik' },
                { value: 'Hindu', label: 'Hindu' },
                { value: 'Buddha', label: 'Buddha' },
                { value: 'Konghucu', label: 'Konghucu' }
            ]
        },
        { name: 'motherName', label: 'Nama Ibu', type: 'text' as const, required: true },
        { name: 'fatherName', label: 'Nama Ayah', type: 'text' as const, required: true },
        { name: 'guardian', label: 'Nama Wali (Opsional)', type: 'text' as const }
    ];

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                const response = await studentsApi.getAll();
                setStudents(response.data);
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
        const student = students.find(s => s.id === id);
        setSelectedStudent(student || null);
        setIsModalOpen(true);
    };

    // Handler untuk delete data
    const handleDelete = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await studentsApi.delete(id);
                setStudents(students.filter(student => student.id !== id));
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    // Handler untuk submit form (add/edit)
    const handleSubmit = async (formData: FormData): Promise<void> => {
        try {
            const studentData = {
                name: formData.name,
                classSchool: formData.classSchool,
                major: formData.major,
                nis: formData.nis,
                nisn: formData.nisn,
                gender: formData.gender,
                birthDate: formData.birthDate,
                birthPlace: formData.birthPlace,
                address: formData.address,
                phone: formData.phone,
                parentPhone: formData.parentPhone,
                religion: formData.religion,
                motherName: formData.motherName,
                fatherName: formData.fatherName,
                guardian: formData.guardian || null,
            };

            if (selectedStudent) {
                // Update existing student
                const response = await studentsApi.update(selectedStudent.id!, studentData);
                setStudents(students.map(student => 
                    student.id === selectedStudent.id ? response.data : student
                ));
            } else {
                // Add new student
                const response = await studentsApi.create(studentData);
                setStudents([...students, response.data]);
            }
            setIsModalOpen(false);
            setSelectedStudent(null);
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
                data={students}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedStudent(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                }}
                onSubmit={handleSubmit}
                title={selectedStudent ? "Edit Data Siswa" : "Tambah Data Siswa"}
                fields={studentFields}
                initialData={selectedStudent || undefined}
                width="w-[40rem]"
            />
        </div>
    );
}