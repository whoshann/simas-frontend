
import { MonthlyFinance } from "../monthly-finances/types";
export interface Expense {
    id?: number;
    description: string;
    amount: number ;
    expenseDate: number;
    monthlyFinanceId?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ExpensesRequest {
    monthlyFinanceId: number;
    amount: number;
    expensedate: string;
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
  