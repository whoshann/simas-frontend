import { MonthlyFinance } from "../monthly-finances/types";

export interface Income {
    id?: number;
    description: string;
    amount: number ;
    source: string;
    incomeDate: number;
    monthlyFinanceId?: number;
    MonthlyFinance: MonthlyFinance;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IncomeRequest {
    monthlyFinanceId: number;
    amount: string;
    source: string;
    incomeDate: string;
    description: string;
  }
  

  export interface UpdateIncomesRequest {
    monthlyFinanceId?: number;
    amount?: number;
    incomedate?: string;
  }
  
  export interface IncomesResponse {
    code: number;
    entity: string;
    incomedata: Income;
  }
  
  export interface IncomesResponses {
    code: number;
    entity: string;
    data: Income[];
  }
   