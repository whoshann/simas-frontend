"use client";

import "@/app/styles/globals.css";
import { useState, useEffect } from 'react';
import { FinanceOverviews } from '@/app/api/finance-overviews/types';
import FinanceOverviewsModal from '@/app/components/finance-overviews/Finance-overviews.Modal';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { FinanceOverviewsHeader } from '@/app/components/finance-overviews/Finance-overviews.Header';
import { FinanceOverviewsActions } from '@/app/components/finance-overviews/Finance-overviews.Action';
import { FinanceOverviewTable } from '@/app/components/finance-overviews/Finance-overviews.Table';
import { FinanceOverviewPagination } from '@/app/components/finance-overviews/Finance-overviews.Pagination';
import { useFinanceOverviews } from '@/app/hooks/useFinanceOverviews';
import { useMonthlyFinances } from '@/app/hooks/useMonthlyFinances';

export default function FinanceOverviewPage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFinanceOverviews, setSelectedFinanceOverviews] = useState<FinanceOverviews | null>(null);

    // Hooks
    const { financeOverviews, loading, error, fetchFinanceOverviews, createFinanceOverviews, updateFinanceOverviews, deleteFinanceOverviews } = useFinanceOverviews();
    const { 
        monthlyFinances, 
        fetchMonthlyFinances 
    } = useMonthlyFinances();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance","SuperAdmin"]);
                setIsAuthorized(true);
                await fetchFinanceOverviews();
                await fetchMonthlyFinances();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null;
    }

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredFinanceOverviews = financeOverviews.filter((financeOverviews: FinanceOverviews) => 
        financeOverviews.monthlyFinance?.month.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalEntries = filteredFinanceOverviews.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedFinanceOverviews = filteredFinanceOverviews.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedFinanceOverviews(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (financeOverviews: FinanceOverviews) => {
        setSelectedFinanceOverviews(financeOverviews);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: FinanceOverviews) => {
        try {
            if (selectedFinanceOverviews) {
                await updateFinanceOverviews(selectedFinanceOverviews.id!, data);
            } else {
                await createFinanceOverviews(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling Finance Overview:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <FinanceOverviewsHeader 
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            /> 

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <FinanceOverviewsActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <FinanceOverviewTable
                        financeOverviews={displayedFinanceOverviews}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteFinanceOverviews}
                    />

                    <FinanceOverviewPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <FinanceOverviewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                financeOverviewsData={selectedFinanceOverviews}
                monthlyFinances={monthlyFinances}
            />
        </div>
    );
}
