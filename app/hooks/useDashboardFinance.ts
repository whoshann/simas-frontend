import { useState, useCallback, useEffect } from 'react';
import { useFinanceOverview } from './useFinanceOverview';
import { useMonthlyFinance } from './useMonthlyFinances';
import { useBudgetManagement } from './useBudgetManagement';
import { FinanceDashboardData } from '../api/dashboard/finance-dashboard';

export const useDashboardFinance = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<FinanceDashboardData>({
        totalBalance: 0,
        lastBalanceUpdate: '',
        totalIncome: 0,
        lastIncomeUpdate: '',
        totalExpenses: 0,
        lastExpenseUpdate: '',
        budgetRequests: []
    });

    const { financeOverview, fetchFinanceOverview } = useFinanceOverview();
    const { monthlyFinances, fetchMonthlyFinances } = useMonthlyFinance();
    const { budgetManagement, fetchBudgetManagement } = useBudgetManagement();

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch data
            await Promise.all([
                fetchFinanceOverview(),
                fetchMonthlyFinances(),
                fetchBudgetManagement()
            ]);

            // Ambil data dari financeOverview
            const overview = financeOverview; // Sesuaikan dengan struktur baru
            
            // Hitung total dari MonthlyFinance
            const totalIncome = monthlyFinances.reduce((sum, item) => sum + Number(item.income), 0);
            const totalExpenses = monthlyFinances.reduce((sum, item) => sum + Number(item.expenses), 0);
            const latestMonthlyFinance = monthlyFinances[monthlyFinances.length - 1];

            const newDashboardData = {
                totalBalance: overview?.totalBalance,
                lastBalanceUpdate: overview?.lastUpdated,
                totalIncome,
                lastIncomeUpdate: latestMonthlyFinance?.updatedAt,
                totalExpenses,
                lastExpenseUpdate: latestMonthlyFinance?.updatedAt,
                budgetRequests: budgetManagement || []
            };
            
            setDashboardData(newDashboardData);

        } catch (err: any) {
            setError(err.message || 'Error fetching dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [financeOverview, monthlyFinances, budgetManagement, fetchFinanceOverview, fetchMonthlyFinances, fetchBudgetManagement]);

    // Tambahkan useEffect untuk memantau perubahan data
    useEffect(() => {
        if (financeOverview && monthlyFinances.length > 0 || budgetManagement.length > 0) {
            const totalIncome = monthlyFinances.reduce((sum, item) => sum + Number(item.income), 0);
            const totalExpenses = monthlyFinances.reduce((sum, item) => sum + Number(item.expenses), 0);
            const latestMonthlyFinance = monthlyFinances[monthlyFinances.length - 1];

            setDashboardData({
                totalBalance: Number(financeOverview?.totalBalance) || 0,
                lastBalanceUpdate: financeOverview?.lastUpdated || '',
                totalIncome,
                lastIncomeUpdate: latestMonthlyFinance?.updatedAt || '',
                totalExpenses,
                lastExpenseUpdate: latestMonthlyFinance?.updatedAt || '',
                budgetRequests: budgetManagement
            });
        }
    }, [financeOverview, monthlyFinances, budgetManagement]);

    // Fetch initial data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { dashboardData, loading, error, fetchDashboardData };
};