import { MonthlyFinance } from "../monthly-finances/types";
export interface Income {
    id?: number;
    monthlyFinanceId: number;
    source: string;
    description?: string;
    amount: string;
    incomeDate: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IncomesRequest {
    monthlyFinanceId: number;
    amount: number;
    incomeDate: string;
    source: string;
    description?: string;
  }
  

  export interface UpdateIncomesRequest {
    monthlyFinanceId?: number;
    amount?: number;
    incomeDate?: string;
  }
  
  export interface IncomesResponse {
    code: number;
    entity: string;
    Data: Income;
  }
  
  export interface IncomesResponses {
    code: number;
    entity: string;
    data: Income[];
  }
  