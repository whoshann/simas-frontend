import { MonthlyFinance } from "../monthly-finances/types";

export interface FinanceOverview {
    id: number;
    totalBalance: number;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    MonthlyFinance: MonthlyFinance[];
}

export interface FinanceOverviewResponse {
    success: boolean;
    code: number;
    message: string;
    data: FinanceOverview;
}
