
import { MonthlyFinance } from "../monthly-finances/types";
export interface Income {
    id?: number;
    source: string;
    description: string;
    amount: number ;
    incomeDate: number;
    monthlyFinanceId?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IncomesRequest {
    monthlyFinanceId: number;
    amount: number;
    incomeDate: string;
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
  