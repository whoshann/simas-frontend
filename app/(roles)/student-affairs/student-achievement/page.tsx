"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/superadmin/DataTable/TableHeader";
import DataTable from "@/app/components/superadmin/DataTable/TableData";
import DynamicModal from "@/app/components/superadmin/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { studentAchievementsApi } from "@/app/api/student-achievements";
import { StudentAchievement } from "@/app/api/student-achievements/types";

interface FormData {
    [key: string]: any;
}

export default function StudentAchievementPage() {
    // State declarations
    const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentAchievement, setSelectedStudentAchievement] = useState<StudentAchievement | null>(null);

    const handleExport = (type: "pdf" | "excel") => {
        if (type === "pdf") {
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
        { key: "achievement", label: "Prestasi" },
        { key: "category", label: "Kategori" },
        { key: "photo", label: "Foto" },
        { key: "date", label: "Tanggal" },
    ];

    // Page content configuration
    const pageContent = {
        title: "Prestasi Siswa",
        greeting: "Halo Super Admin dan Kesiswaan, selamat datang kembali",
    };

    // Form fields configuration
    const studentAchievementFields = [
        { name: "name", label: "Nama Lengkap", type: "text" as const, required: true },
        {
            name: "classSchool",
            label: "Kelas",
            type: "select" as const,
            required: true,
            options: [
                { value: "10", label: "10" },
                { value: "11", label: "11" },
                { value: "12", label: "12" },
            ],
        },
        { name: "achievement", label: "Prestasi", type: "text" as const, required: true },
        {
            name: "category",
            label: "Kategori",
            type: "select" as const,
            required: true,
            options: [
                { value: "akademik", label: "Akademik" },
                { value: "non-akademik", label: "Non Akademik" },
            ],
        },
        { name: "photo", label: "Foto", type: "file" as const, accept: "image/*" },
        { name: "date", label: "Tanggal", type: "date" as const, required: true },
    ];

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin", "StudentAffairs"]);
                const response = await studentAchievementsApi.getAll();
                setStudentAchievements(response.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    // Handler untuk edit data
    const handleEdit = (id: number) => {
        const studentAchievement = studentAchievements.find((s) => s.id === id) || null;
        setSelectedStudentAchievement(studentAchievement);
        setIsModalOpen(true);
    };

    // Handler untuk delete data
    const handleDelete = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await studentAchievementsApi.delete(id);
                setStudentAchievements(
                    studentAchievements.filter((studentAchievement) => studentAchievement.id !== id)
                );
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    // Handler untuk submit form (add/edit)
    const handleSubmit = async (formData: FormData): Promise<void> => {
        try {
            const studentAchievementData: StudentAchievement = {
                name: formData.name,
                classSchool: formData.classSchool,
                achievement: formData.achievement,
                category: formData.category,
                photo: formData.photo,
                date: formData.date,
            };

            if (selectedStudentAchievement) {
                // Update existing student
                const response = await studentAchievementsApi.update(
                    selectedStudentAchievement.id!,
                    studentAchievementData
                );
                const updatedAchievement: StudentAchievement = response.data;
                setStudentAchievements((prev: StudentAchievement[]) => 
                    prev.map((item) => 
                        item.id === selectedStudentAchievement.id ? updatedAchievement : item
                    )
                );
            } else {
                // Add new student
                const response = await studentAchievementsApi.create(studentAchievementData);
                const newAchievement: StudentAchievement = response.data;
                setStudentAchievements((prev: StudentAchievement[]) => [...prev, newAchievement]);
            }
            setIsModalOpen(false);
            setSelectedStudentAchievement(null);
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
                data={studentAchievements}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedStudentAchievement(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudentAchievement(null);
                }}
                onSubmit={handleSubmit}
                title={selectedStudentAchievement ? "Edit Data Siswa" : "Tambah Data Siswa"}
                fields={studentAchievementFields}
                initialData={selectedStudentAchievement || undefined}
                width="w-[40rem]"
            />
        </div>
    );
}
