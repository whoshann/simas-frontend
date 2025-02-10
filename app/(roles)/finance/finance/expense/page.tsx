"use client";
import "@/app/styles/globals.css";
import { Expense, ExpenseRequest } from '@/app/api/expenses/types';
import { ExpensesHeader } from '@/app/components/expenses/ExpenseHeader';
import { ExpenseActions } from '@/app/components/expenses/ExpenseAction';
import { ExpenseTable } from '@/app/components/expenses/ExpenseTable';
import { ExpensePagination } from '@/app/components/expenses/ExpensePagination';
import ExpenseModal from '@/app/components/expenses/ExpenseModal';
import { useExpenses } from '@/app/hooks/useExpenses';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { useState, useEffect } from 'react';
import { useMonthlyFinance } from "@/app/hooks/useMonthlyFinances";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { showSuccessAlert, showErrorAlert, showConfirmDelete } from "@/app/utils/sweetAlert";

export default function ExpensePage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    // Hooks
    const { Expenses, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses();
    const { 
        monthlyFinances, 
        fetchMonthlyFinances 
    } = useMonthlyFinance();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Finance","SuperAdmin"]);
                setIsAuthorized(true);
                await fetchExpenses();
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
    const filteredExpenses = Expenses.filter((expenses: Expense) => 
        expenses.monthlyFinanceId && 
        expenses.monthlyFinanceId.toString().includes(searchTerm.toLowerCase())
    );
    const totalEntries = filteredExpenses.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedExpenses = filteredExpenses.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedExpense(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (expenses: Expense) => {
        setSelectedExpense(expenses);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Expense) => {
        try {
            const requestData: ExpenseRequest = {
                description: data.description,
                monthlyFinanceId: data.monthlyFinanceId!,
                amount: data.amount,  // Pastikan format decimal string
                expenseDate: data.expenseDate
            };
    
            if (selectedExpense) {
                await updateExpense(selectedExpense.id!, requestData);
                await fetchExpenses();
                await showSuccessAlert('Success', 'Data pengeluaran berhasil diperbarui!');
            } else {
                await createExpense(requestData);
                await fetchExpenses();
                await showSuccessAlert('Success', 'Data pengeluaran berhasil ditambahkan!');
            }
            // Refresh data
        } catch (error) {
            console.error('Error:', error);
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
            <ExpensesHeader 
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <ExpenseActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        expenses={filteredExpenses}
                    />

                    <ExpenseTable
                        expenses={displayedExpenses}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteExpense}
                    />

                    <ExpensePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>
            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                expenseData={selectedExpense}
                monthlyFinances={monthlyFinances}
            />
        </div>
    );
}
