"use client";
import "@/app/styles/globals.css";
import { Income, IncomeRequest } from '@/app/api/incomes/types';
import { IncomeHeader } from '@/app/components/incomes/IncomeHeader';
import { IncomeActions } from '@/app/components/incomes/IncomeAction';
import { IncomeTable } from '@/app/components/incomes/IncomeTable';
import { IncomePagination } from '@/app/components/incomes/IncomePagination';
import IncomeModal from '@/app/components/incomes/IncomeModal';
import { useIncomes } from '@/app/hooks/useIncomes';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { useState, useEffect } from 'react';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { showSuccessAlert, showErrorAlert, showConfirmDelete } from "@/app/utils/sweetAlert";
import { useMonthlyFinance } from "@/app/hooks/useMonthlyFinances";

export default function IncomePage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

    // Hooks
    const { Incomes, loading, error, fetchIncomes, createIncome, updateIncome, deleteIncome } = useIncomes();
    const { 
        monthlyFinances, 
        fetchMonthlyFinances 
    } = useMonthlyFinance();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance","SuperAdmin"]);
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


    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredIncomes = Incomes.filter((incomes: Income) => 
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

    const handleEditClick = (incomes: Income) => {
        setSelectedIncome(incomes);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Income) => {
        try {
            const requestData: IncomeRequest = {
                source: data.source,
                description: data.description,
                monthlyFinanceId: data.monthlyFinanceId!,
                amount: data.amount,  // Pastikan format decimal string
                incomeDate: data.incomeDate
            };
    
            console.log('Data yang dikirim:', requestData);
    
            if (selectedIncome) {
                await updateIncome(selectedIncome.id!, requestData);
                await showSuccessAlert('Berhasil', 'Data pemasukan berhasil diperbarui!');
            } else {
                await createIncome(requestData);
                await showSuccessAlert('Berhasil', 'Data pemasukan berhasil ditambahkan!');
            }
            // Refresh data
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menambahkan data pemasukan');
        }
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                <IncomeHeader 
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
                        incomes={filteredIncomes}
                    />

                    <IncomeTable
                        incomes={displayedIncomes}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteIncome}
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
                onSubmit={handleSubmit}
                incomeData={selectedIncome}
                monthlyFinances={monthlyFinances}
            />
        </div>
    );
}
