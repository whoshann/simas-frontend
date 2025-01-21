"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/superadmin/DataTable/TableHeader";
import DataTable from "@/app/components/superadmin/DataTable/TableData";
import DynamicModal from "@/app/components/superadmin/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { newsinformationsApi } from "@/app/api/news-informations";
import { NewsInformation } from "@/app/api/news-informations/types";



interface FormData {
    [key: string]: any;
}

export default function NewsInformationPage() {
    // State declarations
    const [NewsInformations, setNewsInformations] = useState<NewsInformation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNewsInformation, setSelectedNewsInformation] = useState<NewsInformation | null>(null);

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
        { key: "title", label: "Judul" },
        { key: "description", label: "Deskripsi" },
        { key: "date", label: "Tanggal" },
    ];

    // Page content configuration
    const pageContent = {
        title: "Berita Sekolah",
        greeting: "Halo Super Admin, selamat datang kembali"
    };

    // Form fields configuration
    const newsinformationFields = [
        { name: 'name', label: 'Nama Berita', type: 'text' as const, required: true },
        { name: 'title', label: 'Judul Berita', type: 'text' as const, required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' as const, required: true },
        { name: 'date', label: 'Tanggal Berita', type: 'date' as const, required: true },
    
      
    ];

    // Fetch data saat komponen dimount
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin", "StudentAffairs"]);
                const response = await newsinformationsApi.getAll();
                setNewsInformations(response.data);
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
        const newsinformation = NewsInformations.find(s => s.id === id);
        setSelectedNewsInformation(newsinformation || null);
        setIsModalOpen(true);
    };

    // Handler untuk delete data
    const handleDelete = async (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                await newsinformationsApi.delete(id);
                setNewsInformations(NewsInformations.filter(newsinformation => newsinformation.id !== id));
            } catch (error) {
                console.error("Error menghapus berita:", error);
            }
        }
    };

    // Handler untuk submit form (add/edit)
    const handleSubmit = async (formData: FormData): Promise<void> => {
        try {
            const NewsInformationData = {
                name: formData.name,
                title: formData.title,
                description: formData.description,
                date: formData.date,
            };

            if (selectedNewsInformation) {
                // Update existing news information
                const response = await newsinformationsApi.update(selectedNewsInformation.id!, NewsInformationData);
                const updatedNews = response.data as NewsInformation;
                setNewsInformations(prevNews => 
                    prevNews.map(newsInfo => 
                        newsInfo.id === selectedNewsInformation.id ? updatedNews : newsInfo
                    )
                );
            } else {
                // Add new news information
                const response = await newsinformationsApi.create(NewsInformationData);
                const newNews = response.data as NewsInformation;
                setNewsInformations(prevNews => [...prevNews, newNews]);
            }
            setIsModalOpen(false);
            setSelectedNewsInformation(null);
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
                data={NewsInformations}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedNewsInformation(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={handleExport}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedNewsInformation(null);
                }}
                onSubmit={handleSubmit}
                title={selectedNewsInformation ? "Edit Berita" : "Tambah Berita"}
                fields={newsinformationFields}
                initialData={selectedNewsInformation || undefined}
                width="w-[40rem]"
            />
        </div>
    );
}