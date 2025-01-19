"use client";

import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { useIncome } from "@/app/hooks/useIncomes";
import { useExpenses } from "@/app/hooks/useExpenses";
import { financeoverviewsApi } from "@/app/api/finance-overviews";
import { MonthlyFinanceHeader } from "@/app/components/monthly-finances/MonthlyFinance.Header";
import { MonthlyFinanceChart } from "@/app/components/monthly-finances/MonthlyFinance.Chart";
import { MonthlyFinanceApi } from "@/app/api/monthly-finances";

export default function MonthlyFinancesPage() {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [remainingBalance, setRemainingBalance] = useState<number>(0);
    const { fetchExpenses } = useExpenses();
    const { fetchIncomes } = useIncome();
    const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expense: number }[]>([]);

    useEffect(() => {
        const initializePage = async () => {
            await roleMiddleware(["Finance", "SuperAdmin"]);
            await fetchData();
        };
        initializePage();
    }, []);

    const fetchData = async () => {
        try {
            // Ambil data pendapatan
            const incomesData = await fetchIncomes();
            // Ambil data pengeluaran
            const expensesData = await fetchExpenses();

            // Hitung total pendapatan dan pengeluaran
            const monthlyIncome = incomesData.reduce((acc: number, income: { amount: number }) => acc + income.amount, 0);
            const monthlyExpense = expensesData.reduce((acc: number, expense: { amount: number }) => acc + expense.amount, 0);

            // Set state dengan hasil perhitungan
            setTotalIncome(monthlyIncome);
            setTotalExpense(monthlyExpense);
            setRemainingBalance(monthlyIncome - monthlyExpense);

            // Update data bulanan (hanya simulasi)
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember",
            ];
            const updatedMonthlyData = months.map(month => ({
                month,
                income: monthlyIncome, // Data simulasi
                expense: monthlyExpense, // Data simulasi
            }));
            setMonthlyData(updatedMonthlyData);

            // Simpan data ke server
            await createMonthlyFinance({
                month: new Date().toLocaleString("default", { month: "long" }),
                income: monthlyIncome,
                expenses: monthlyExpense,
                remainingBalance: monthlyIncome - monthlyExpense,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const createMonthlyFinance = async (data: { month: string; income: number; expenses: number; remainingBalance: number }) => {
        try {
            const formData = new FormData();
            formData.append("month", data.month);
            formData.append("income", data.income.toString());
            formData.append("expenses", data.expenses.toString());
            formData.append("remainingBalance", data.remainingBalance.toString());

            await MonthlyFinanceApi.create(formData);
        } catch (error) {
            console.error("Error creating monthly finance:", error);
        }
    };

    useEffect(() => {
        const handleUpdateFinanceOverview = async () => {
            if (remainingBalance !== 0) {
                try {
                    await financeoverviewsApi.update(1, {
                        totalBalance: remainingBalance,
                        lastUpdate: new Date().toISOString().split("T")[0],
                    });
                } catch (error) {
                    console.error("Error updating finance overview:", error);
                }
            }
        };
        handleUpdateFinanceOverview();
    }, [remainingBalance]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <MonthlyFinanceHeader
                searchTerm="" // Ganti dengan state jika diperlukan
                onSearchChange={() => {}} // Ganti dengan handler pencarian jika diperlukan
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <MonthlyFinanceChart monthlyData={monthlyData} />
                </div>
            </main>
        </div>
    );
}
