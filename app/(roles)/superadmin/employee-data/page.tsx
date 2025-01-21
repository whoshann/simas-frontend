"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Image from 'next/image';

interface FormData {
    [key: string]: any;
}

interface Employee extends FormData {
    id?: number;
    photo?: string;
    fullName: string;
    gender: 'Laki-Laki' | 'Perempuan';
    placeOfBirth: string;
    dateOfBirth: string;
    fullAddress: string;
    lastEducation: string;
    lastEducationMajor: string;
    phoneNumber: string;
    category: 'Administrator' | 'Security' | 'Cleaning Services';
    maritalStatus: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function EmployeePage() {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
        { key: "id", label: "No" },
        {
            key: "photo",
            label: "Foto",
            render: (value: string, row: any) => (
                <div className="w-16 h-16 overflow-hidden rounded">
                    <Image
                        src={value || "/images/profile.jpg"}
                        alt={`Foto ${row.fullName}`}
                        className="w-full h-full object-cover"
                        width={256}
                        height={256}
                        onError={(e: any) => {
                            e.target.src = "/images/profile.jpg";
                        }}
                    />
                </div>
            )
        },
        { key: "fullName", label: "Nama Lengkap" },
        { key: "gender", label: "Jenis Kelamin" },
        { key: "dateOfBirth", label: "Tanggal Lahir" },
        { key: "placeOfBirth", label: "Tempat Lahir" },
        { key: "fullAddress", label: "Alamat" },
        { key: "phoneNumber", label: "Nomor Telepon" },
        { key: "lastEducation", label: "Pendidikan Terakhir" },
        { key: "lastEducationMajor", label: "Jurusan Pendidikan Terakhir" },
        { key: "category", label: "Kategori" },
        { key: "maritalStatus", label: "Status Pernikahan" }
    ];

    const pageContent = {
        title: "Data Karyawan",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    // Form fields configuration
    const employeeFields = [
        {
            name: 'photo',
            label: 'Foto',
            type: 'file' as const,
            required: false,
            accept: 'image/*',
            colSpan: 2
        },
        { name: 'fullName', label: 'Nama Lengkap', type: 'text' as const, required: true },
        {
            name: 'gender',
            label: 'Jenis Kelamin',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Laki-Laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ]
        },
        {
            name: 'dateOfBirth',
            label: 'Tanggal Lahir',
            type: 'date' as const,
            required: true,
            valueFormat: (value: string) => value ? value.split('T')[0] : ''
        },
        { name: 'placeOfBirth', label: 'Tempat Lahir', type: 'text' as const, required: true },
        { name: 'fullAddress', label: 'Alamat Lengkap', type: 'textarea' as const, required: true, colSpan: 2 },
        { name: 'phoneNumber', label: 'Nomor Telepon', type: 'tel' as const, required: true },
        {
            name: 'lastEducation',
            label: 'Pendidikan Terakhir',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'SD', label: 'SD' },
                { value: 'SMP', label: 'SMP' },
                { value: 'SMA/SMK', label: 'SMA/SMK' },
                { value: 'D3', label: 'D3' },
                { value: 'S1', label: 'S1' },
                { value: 'S2', label: 'S2' }
            ]
        },
        { name: 'lastEducationMajor', label: 'Jurusan Pendidikan Terakhir', type: 'text' as const, required: true },
        {
            name: 'category',
            label: 'Kategori',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Administrator', label: 'Administrasi' },
                { value: 'Security', label: 'Keamanan' },
                { value: 'Cleaning Services', label: 'Cleaning Service' }
            ]
        },
        {
            name: 'maritalStatus',
            label: 'Status Pernikahan',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Belum Menikah', label: 'Belum Menikah' },
                { value: 'Menikah', label: 'Menikah' },
                { value: 'Cerai', label: 'Cerai' }
            ]
        }
    ];
    // Sample data
    const employeeData: Employee[] = [
        {
            id: 1,
            photo: "/images/Berita1.jpg",
            fullName: "Ahmad Santoso",
            gender: "Laki-Laki",
            dateOfBirth: "1985-04-15",
            placeOfBirth: "Jakarta",
            fullAddress: "Jl. Mawar No. 10, Jakarta Selatan",
            phoneNumber: "081234567890",
            lastEducation: "SMA/SMK",
            lastEducationMajor: "Administrasi Perkantoran",
            category: "Administrator",
            maritalStatus: "Menikah",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: 2,
            photo: "/images/Berita1.jpg",
            fullName: "Siti Rahayu",
            gender: "Perempuan",
            dateOfBirth: "1990-07-18",
            placeOfBirth: "Bandung",
            fullAddress: "Jl. Melati No. 15, Bandung",
            phoneNumber: "081234567891",
            lastEducation: "D3",
            lastEducationMajor: "Manajemen Bisnis",
            category: "Administrator",
            maritalStatus: "Belum Menikah",
            createdAt: "2024-01-Menikah00:00:00Z",
            updatedAt: "2024-01-01T00:Cerai:00Z"
        },
        {
            id: 3,
            photo: "/images/Berita1.jpg",
            fullName: "Budi Prakoso",
            gender: "Laki-Laki",
            dateOfBirth: "1988-03-24",
            placeOfBirth: "Surabaya",
            fullAddress: "Jl. Anggrek No. 20, Surabaya",
            phoneNumber: "081234567892",
            lastEducation: "SMA/SMK",
            lastEducationMajor: "Teknik Keamanan",
            category: "Security",
            maritalStatus: "Menikah",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: 4,
            photo: "/images/Berita1.jpg",
            fullName: "Dewi Lestari",
            gender: "Perempuan",
            dateOfBirth: "1992-05-12",
            placeOfBirth: "Yogyakarta",
            fullAddress: "Jl. Dahlia No. 25, Yogyakarta",
            phoneNumber: "081234567893",
            lastEducation: "SMP",
            lastEducationMajor: "SMP",
            category: "Cleaning Services",
            maritalStatus: "Menikah",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
        },
        {
            id: 5,
            photo: "/images/Berita1.jpg",
            fullName: "Rudi Hermawan",
            gender: "Laki-Laki",
            dateOfBirth: "1995-08-30",
            placeOfBirth: "Semarang",
            fullAddress: "Jl. Kenanga No. 30, Semarang",
            phoneNumber: "081234567894",
            lastEducation: "SMA/SMK",
            lastEducationMajor: "Teknik Keamanan",
            category: "Security",
            maritalStatus: "Belum Menikah",
            createdAt: "2024-01-Menikah00:00:00Z",
            updatedAt: "2024-01-01T00:Cerai:00Z"
        }
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleEdit = (id: number) => {
        const employee = employeeData.find(t => t.no === id);
        setSelectedEmployee(employee || null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete employee:", id);
    };

    const handleSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                if (key === 'photo' && data[key] instanceof File) {
                    formData.append('photo', data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            console.log("Submit data:", formData);
            setIsModalOpen(false);
            setSelectedEmployee(null);
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
                data={employeeData}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedEmployee(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />


            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEmployee(null);
                }}
                onSubmit={handleSubmit}
                title={selectedEmployee ? "Edit Data Guru" : "Tambah Data Guru"}
                fields={employeeFields}
                initialData={selectedEmployee || undefined}
                width="w-[40rem]"
            />
        </div >
    );
}