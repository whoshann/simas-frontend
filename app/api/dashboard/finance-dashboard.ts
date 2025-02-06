import { BudgetManagement } from "../budget-management/types";
import { FinanceOverview } from "../finance-overview/types";
import { MonthlyFinance } from "../monthly-finances/types";

export interface FinanceDashboardData {
    totalBalance: number;
    lastBalanceUpdate: string;
    totalIncome: number;
    lastIncomeUpdate: string;
    totalExpenses: number;
    lastExpenseUpdate: string;
    budgetRequests: BudgetManagement[];
}