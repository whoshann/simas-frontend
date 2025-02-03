export interface MonthlyFinance {
    id?: number;
    month: string;
    income: number;
    expenses: number;
    remainingBalance: number;
    financeOverviewId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMonthlyFinanceDto {
    month: string;
    income: number;
    expenses: number;
    remainingBalance: number;
    financeOverviewId: number;
}

export interface UpdateMonthlyFinanceDto extends Partial<CreateMonthlyFinanceDto> {}

export interface MonthlyFinanceResponse {
    code: number;
    entity: string;
    data: MonthlyFinance;
}

export interface MonthlyFinancesResponse {
    code: number;
    entity: string;
    data: MonthlyFinance[];
}
  