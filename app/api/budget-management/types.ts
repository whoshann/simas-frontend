import { BudgetManagementStatus } from "@/app/utils/enums";
import { User } from "../user/types";

export interface BudgetManagement {
    id?: number;
    title: string;
    description: string;
    total_budget:number;
    document_path: string;
    status: BudgetManagementStatus;
    userId: number;
    user: User;
    updateMessage: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface BudgetManagementResponse {
    success: boolean;
    code: string;
    message: string;
    data: BudgetManagement[];
  }