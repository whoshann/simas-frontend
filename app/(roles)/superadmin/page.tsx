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


    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
        Hello World
        </div>
    );
}
