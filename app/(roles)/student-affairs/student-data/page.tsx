"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useStudents } from "@/app/hooks/useStudentData";
import { Student } from "@/app/api/student-data/types";


interface FormData {
    [key: string]: any;
}

export default function StudentPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const {
        students,
        loading,
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent
    } = useStudents();

    // State declarations
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                await fetchStudents();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') {
            console.log("Exporting to PDF...");
        } else {
            console.log("Exporting to Excel...");
        }
    };

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    // Table headers configuration
    const headers = [
        { key: "id", label: "No" },
        { key: "name", label: "Nama" },
        { key: "nis", label: "NIS" },
        { key: "nisn", label: "NISN" },
        {
            key: "classSchool",
            label: "Kelas",
            render: (value: string) => value || '-'
        },
        {
            key: "major",
            label: "Jurusan",
            render: (value: string) => value || '-'
        },
        {
            key: "birthDate",
            label: "Tanggal Lahir",
            render: (value: string) => formatDate(value)
        },
        { key: "birthPlace", label: "Tempat Lahir" },
        {
            key: "gender",
            label: "Jenis Kelamin",
            render: (value: string) => value === 'L' ? 'Laki-laki' : 'Perempuan'
        },
        { key: "address", label: "Alamat" },
        { key: "phone", label: "Nomor" },
        { key: "parentPhone", label: "Nomor Orang Tua" },
        {
            key: "religion",
            label: "Agama",
            render: (value: string) => {
                const religions = {
                    'ISLAM': 'Islam',
                    'CHRISTIANITY': 'Kristen',
                    'HINDUISM': 'Hindu',
                    'BUDDHISM': 'Buddha',
                    'CONFUCIANISM': 'Konghucu',
                    'CATHOLICISM': 'Katolik'
                };
                return religions[value as keyof typeof religions];
            }
        },
        { key: "motherName", label: "Nama Ibu" },
        { key: "fatherName", label: "Nama Ayah" },
        { key: "guardian", label: "Nama Wali" }
    ];

    // Page content configuration
    const pageContent = {
        title: "Data Siswa",
        greeting: "Halo Admin Kesiswaan, selamat datang kembali"
    };

    // Form fields configuration
    const studentFields = [
        { name: 'name', label: 'Nama Lengkap', type: 'text' as const, required: true },
        {
            name: 'classId',
            label: 'Kelas',
            type: 'select' as const,
            required: true,
            options: [
                { value: '1', label: 'X RPL A' },
                { value: '2', label: 'X RPL B' },
                { value: '3', label: 'X RPL C' },
                { value: '4', label: 'X TKJ A' },
                { value: '5', label: 'X TKJ B' },
                { value: '6', label: 'X TKJ C' },
            ]
        },
        {
            name: 'majorId',
            label: 'Jurusan',
            type: 'select' as const,
            required: true,
            options: [
                { value: '1', label: 'Rekayasa Perangkat Lunak' },
                { value: '2', label: 'Teknik Komputer dan Jaringan ' },
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
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' }
            ]
        },
        {
            name: 'birthDate',
            label: 'Tanggal Lahir',
            type: 'date' as const,
            required: true,
            valueFormat: (value: string) => value ? value.split('T')[0] : ''
        },
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

    // Handler untuk edit data
    const handleEdit = (id: number) => {
        const student = students.find(s => s.id === id);
        if (student) {
            // Format tanggal sebelum menampilkan di form
            const formattedStudent = {
                ...student,
                birthDate: student.birthDate ? student.birthDate.split('T')[0] : ''
            };
            setSelectedStudent(formattedStudent);
            setIsModalOpen(true);
        }
    };

    // Handler untuk delete data
    const handleDelete = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await deleteStudent(id);
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
                await updateStudent(selectedStudent.id!, studentData);
            } else {
                // Add new student
                await createStudent(studentData);
            }
            setIsModalOpen(false);
            setSelectedStudent(null);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    if (isPageLoading) return <LoadingSpinner />;

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