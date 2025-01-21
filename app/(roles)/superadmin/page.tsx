"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import HeaderSection from "@/app/components/DataTable/TableHeader";
import TableActions from "@/app/components/DataTable/TableAction";
import DataTable from "@/app/components/DataTable/TableData";
import TablePagination from "@/app/components/DataTable/TablePagination";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";

export default function SuperAdminHomePage() {

    const data = [
        {
            no: 1,
            name: "Ahmad Rizky",
            classSchool: "10",
            major: "IPA 1",
            nis: "2024001",
            nisn: "1234567890",
            gender: "Laki-laki",
            birthDate: "15/03/2008",
            birthPlace: "Jakarta",
            address: "Jl. Mawar No. 10, Jakarta Selatan",
            phone: "081234567890",
            parentPhone: "081234567891",
            religion: "Islam",
            motherName: "Siti Aminah",
            fatherName: "Budi Santoso",
            guardian: "Haji Slamet"
        },
        {
            no: 2,
            name: "Siti Nurhaliza",
            classSchool: "11",
            major: "IPS 2",
            nis: "2024002",
            nisn: "1234567891",
            gender: "Perempuan",
            birthDate: "22/05/2007",
            birthPlace: "Bandung",
            address: "Jl. Melati No. 15, Bandung",
            phone: "081234567892",
            parentPhone: "081234567893",
            religion: "Islam",
            motherName: "Nur Aini",
            fatherName: "Ahmad Yani",
            guardian: null
        },
        {
            no: 3,
            name: "Michael Wijaya",
            classSchool: "12",
            major: "IPA 3",
            nis: "2024003",
            nisn: "1234567892",
            gender: "Laki-laki",
            birthDate: "10/08/2006",
            birthPlace: "Surabaya",
            address: "Jl. Anggrek No. 20, Surabaya",
            phone: "081234567894",
            parentPhone: "081234567895",
            religion: "Kristen",
            motherName: "Linda Wijaya",
            fatherName: "Robert Wijaya",
            guardian: "Tante Maria"
        },
        {
            no: 4,
            name: "Putri Rahayu",
            classSchool: "10",
            major: "IPS 1",
            nis: "2024004",
            nisn: "1234567893",
            gender: "Perempuan",
            birthDate: "05/12/2008",
            birthPlace: "Yogyakarta",
            address: "Jl. Kamboja No. 25, Yogyakarta",
            phone: "081234567896",
            parentPhone: "081234567897",
            religion: "Islam",
            motherName: "Sri Rahayu",
            fatherName: "Bambang Sutejo",
            guardian: null
        },
        {
            no: 5,
            name: "David Chen",
            classSchool: "11",
            major: "IPA 2",
            nis: "2024005",
            nisn: "1234567894",
            gender: "Laki-laki",
            birthDate: "18/09/2007",
            birthPlace: "Medan",
            address: "Jl. Dahlia No. 30, Medan",
            phone: "081234567898",
            parentPhone: "081234567899",
            religion: "Buddha",
            motherName: "Lily Chen",
            fatherName: "Jimmy Chen",
            guardian: "Paman Alex"
        },
        {
            no: 6,
            name: "Anisa Fitriani",
            classSchool: "12",
            major: "IPS 3",
            nis: "2024006",
            nisn: "1234567895",
            gender: "Perempuan",
            birthDate: "25/04/2006",
            birthPlace: "Semarang",
            address: "Jl. Kenanga No. 35, Semarang",
            phone: "081234567900",
            parentPhone: "081234567901",
            religion: "Islam",
            motherName: "Fatimah",
            fatherName: "Abdul Rahman",
            guardian: null
        },
        {
            no: 7,
            name: "Budi Prakoso",
            classSchool: "10",
            major: "IPA 1",
            nis: "2024007",
            nisn: "1234567896",
            gender: "Laki-laki",
            birthDate: "30/11/2008",
            birthPlace: "Malang",
            address: "Jl. Tulip No. 40, Malang",
            phone: "081234567902",
            parentPhone: "081234567903",
            religion: "Islam",
            motherName: "Suryani",
            fatherName: "Hendra Prakoso",
            guardian: "Kakek Suryo"
        },
        {
            no: 8,
            name: "Grace Patricia",
            classSchool: "11",
            major: "IPS 2",
            nis: "2024008",
            nisn: "1234567897",
            gender: "Perempuan",
            birthDate: "12/06/2007",
            birthPlace: "Manado",
            address: "Jl. Bougenville No. 45, Manado",
            phone: "081234567904",
            parentPhone: "081234567905",
            religion: "Kristen",
            motherName: "Sarah Patricia",
            fatherName: "John Patricia",
            guardian: null
        },
        {
            no: 9,
            name: "Reza Mahendra",
            classSchool: "12",
            major: "IPA 3",
            nis: "2024009",
            nisn: "1234567898",
            gender: "Laki-laki",
            birthDate: "08/02/2006",
            birthPlace: "Palembang",
            address: "Jl. Teratai No. 50, Palembang",
            phone: "081234567906",
            parentPhone: "081234567907",
            religion: "Islam",
            motherName: "Dewi Sartika",
            fatherName: "Agus Mahendra",
            guardian: "Bibi Rina"
        },
        {
            no: 10,
            name: "Maya Indah",
            classSchool: "10",
            major: "IPS 1",
            nis: "2024010",
            nisn: "1234567899",
            gender: "Perempuan",
            birthDate: "20/07/2008",
            birthPlace: "Makassar",
            address: "Jl. Flamboyan No. 55, Makassar",
            phone: "081234567908",
            parentPhone: "081234567909",
            religion: "Islam",
            motherName: "Ratna Sari",
            fatherName: "Dedi Kusuma",
            guardian: null
        }
    ];

    // State declarations
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                setLoading(false)

            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Data processing
    const filteredData = data.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(
        startIndex,
        startIndex + entriesPerPage
    );

    // Event handlers
    const handleEdit = (id: number) => {
        console.log("Edit item:", id);
        // Implementasi edit
    };

    const handleDelete = (id: number) => {
        console.log("Delete item:", id);
        // Implementasi delete
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            {/* Header Section */}
            <HeaderSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    {/* Table Actions Section */}
                    <TableActions
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    {/* Data Table Section */}
                    <DataTable
                        currentEntries={currentEntries}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Pagination Section */}
                    <TablePagination
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </main>
        </div>
    );
}
