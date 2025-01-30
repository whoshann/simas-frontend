"use client";
import "@/app/styles/globals.css";
import { Income, IncomesRequest } from '@/app/api/incomes/types';
import { IncomesHeader } from '@/app/components/incomes/IncomeHeader';
import { IncomeActions } from '@/app/components/incomes/IncomeAction';
import { IncomeTable } from '@/app/components/incomes/IncomeTable';
import { IncomePagination } from '@/app/components/incomes/IncomePagination';
import IncomeModal from '@/app/components/incomes/IncomeModal';
import { useIncome } from '@/app/hooks/useIncomes';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { useState, useEffect } from 'react';
import { useMonthlyFinances } from '@/app/hooks/useMonthlyFinances';

export default function IncomeDataPage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

    const { incomes, loading, error, fetchIncomes, createIncomes, updateIncomes, deleteIncomes } = useIncome();
    const { monthlyFinances, fetchMonthlyFinances } = useMonthlyFinances();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance", "SuperAdmin"]);
                setIsAuthorized(true);
                await fetchIncomes();
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
    const filteredIncomes = incomes.filter((incomes: Income) =>
        incomes.monthlyFinanceId &&
        incomes.monthlyFinanceId.toString().includes(searchTerm.toLowerCase())
    );
    const totalEntries = filteredIncomes.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedIncomes = filteredIncomes.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedIncome(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (income: Income) => {
        setSelectedIncome(income);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: Income) => {
        try {
            const incomeData: IncomesRequest = {
                monthlyFinanceId: data.monthlyFinanceId!,
                amount: Number(data.amount),
                incomeDate: data.incomeDate.toString(),
                source: data.source,
                description: data.description
            };

            if (selectedIncome) {
                await updateIncomes(selectedIncome.id!, incomeData);
            } else {
                await createIncomes(incomeData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling income:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <IncomesHeader
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <IncomeActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <IncomeTable
                        incomes={displayedIncomes}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteIncomes}
                    />

                    <IncomePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>
            <IncomeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                incomeData={selectedIncome}
                monthlyFinances={monthlyFinances}
            />
        </div>
    );
}
