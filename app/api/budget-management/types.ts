import { DispenseStatus } from "@/app/utils/enums";

export interface BudgetManagement {
    id?: number;
    name: string;
    role: string;
    title: string;
    description: string;
    amount:number;
    document: string;
    date:String;
    status: DispenseStatus;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface BudgetManagementResponse {
    success: boolean;
    code: string;
    message: string;
    data: BudgetManagement[];
  }