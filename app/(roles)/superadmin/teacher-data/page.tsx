"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/superadmin/DataTable/TableHeader";
import DataTable from "@/app/components/superadmin/DataTable/TableData";
import DynamicModal from "@/app/components/superadmin/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Image from 'next/image';

interface FormData {
    [key: string]: any;
}

interface Teacher extends FormData {
    no: number;
    photo: string;
    name: string;
    nip: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    address: string;
    phone: string;
    lastEducation: string;
    majorLastEducation: string;
    subject: string;
    position: string;
}

export default function TeacherPage() {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

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
        {
            key: "photo",
            label: "Foto",
            render: (value: string, row: any) => (
                <div className="w-16 h-16 overflow-hidden rounded">
                    <Image
                        src={value || "/images/profile.jpg"}
                        alt={`Foto ${row.name}`}
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
        { key: "name", label: "Nama" },
        { key: "nip", label: "NIP" },
        { key: "gender", label: "Jenis Kelamin" },
        { key: "birthDate", label: "Tanggal Lahir" },
        { key: "birthPlace", label: "Tempat Lahir" },
        { key: "address", label: "Alamat" },
        { key: "phone", label: "Nomor" },
        { key: "lastEducation", label: "Pendidikan Terakhir" },
        { key: "majorLastEducation", label: "Jurusan Pendidikan Terakhir" },
        { key: "subject", label: "Mata Pelajaran" },
        { key: "position", label: "Jabatan" },
    ];

    const pageContent = {
        title: "Data Guru",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    // Form fields configuration
    const teacherFields = [
        {
            name: 'photo',
            label: 'Foto',
            type: 'file' as const,
            required: true,
            accept: 'image/*',
            colSpan: 2
        },
        { name: 'name', label: 'Nama Lengkap', type: 'text' as const, required: true },
        { name: 'nip', label: 'NIP', type: 'text' as const, required: true },
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
        {
            name: 'lastEducation',
            label: 'Pendidikan Terakhir',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'S1', label: 'S1' },
                { value: 'S2', label: 'S2' },
                { value: 'S3', label: 'S3' }
            ]
        },
        { name: 'majorLastEducation', label: 'Jurusan Pendidikan Terakhir', type: 'text' as const, required: true },
        { name: 'subject', label: 'Mata Pelajaran', type: 'text' as const, required: true },
        {
            name: 'position',
            label: 'Jabatan',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Kepala Sekolah', label: 'Kepala Sekolah' },
                { value: 'Wakil Kepala Sekolah', label: 'Wakil Kepala Sekolah' },
                { value: 'Guru', label: 'Guru' }
            ]
        }
    ];

    // Sample data
    const teachersData: Teacher[] = [
        {
            no: 1,
            photo: "/images/Berita1.jpg",
            name: "Dr. Ahmad Sulaiman",
            nip: "196504151990031002",
            gender: "Laki-laki",
            birthDate: "15/04/1965",
            birthPlace: "Jakarta",
            address: "Jl. Mawar No. 10, Jakarta Selatan",
            phone: "081234567890",
            lastEducation: "S3",
            majorLastEducation: "Manajemen Pendidikan",
            subject: "Matematika",
            position: "Kepala Sekolah"
        },
        {
            no: 2,
            photo: "/images/Berita1.jpg",
            name: "Siti Aminah, M.Pd",
            nip: "198707182010042003",
            gender: "Perempuan",
            birthDate: "18/07/1987",
            birthPlace: "Bandung",
            address: "Jl. Melati No. 15, Bandung",
            phone: "081234567891",
            lastEducation: "S2",
            majorLastEducation: "Pendidikan Bahasa Inggris",
            subject: "Bahasa Inggris",
            position: "Wakil Kepala Sekolah"
        },
        {
            no: 3,
            photo: "/images/Berita1.jpg",
            name: "Budi Santoso, S.Pd",
            nip: "199003242012011004",
            gender: "Laki-laki",
            birthDate: "24/03/1990",
            birthPlace: "Surabaya",
            address: "Jl. Anggrek No. 20, Surabaya",
            phone: "081234567892",
            lastEducation: "S1",
            majorLastEducation: "Pendidikan Fisika",
            subject: "Fisika",
            position: "Guru"
        },
        {
            no: 4,
            photo: "/images/Berita1.jpg",
            name: "Dewi Lestari, M.Si",
            nip: "198505122009042001",
            gender: "Perempuan",
            birthDate: "12/05/1985",
            birthPlace: "Yogyakarta",
            address: "Jl. Dahlia No. 25, Yogyakarta",
            phone: "081234567893",
            lastEducation: "S2",
            majorLastEducation: "Kimia",
            subject: "Kimia",
            position: "Guru"
        },
        {
            no: 5,
            photo: "/images/Berita1.jpg",
            name: "Rudi Hermawan, S.Kom",
            nip: "199208302015041005",
            gender: "Laki-laki",
            birthDate: "30/08/1992",
            birthPlace: "Semarang",
            address: "Jl. Kenanga No. 30, Semarang",
            phone: "081234567894",
            lastEducation: "S1",
            majorLastEducation: "Teknik Informatika",
            subject: "Informatika",
            position: "Guru"
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
        const teacher = teachersData.find(t => t.no === id);
        setSelectedTeacher(teacher || null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete teacher:", id);
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
            setSelectedTeacher(null);
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
                data={teachersData}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedTeacher(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />


            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTeacher(null);
                }}
                onSubmit={handleSubmit}
                title={selectedTeacher ? "Edit Data Guru" : "Tambah Data Guru"}
                fields={teacherFields}
                initialData={selectedTeacher || undefined}
                width="w-[40rem]"
            />
        </div >
    );
}