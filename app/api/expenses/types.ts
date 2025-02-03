import { MonthlyFinance } from "../monthly-finances/types";

export interface Expense {
    id?: number;
    description: string;
    amount: number ;
    expenseDate: number;
    monthlyFinanceId?: number;
    MonthlyFinance: MonthlyFinance;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ExpenseRequest {
    monthlyFinanceId: number;
    amount: string;
    expenseDate: string;
    description: string;
  }
  

  export interface UpdateExpensesRequest {
    monthlyFinanceId?: number;
    amount?: number;
    expensedate?: string;
  }
  
  export interface ExpensesResponse {
    code: number;
    entity: string;
    expensedata: Expense;
  }
  
  export interface ExpensesResponses {
    code: number;
    entity: string;
    data: Expense[];
  }
  