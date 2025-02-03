import { MonthlyFinance } from "../monthly-finances/types";

export interface FinanceOverviews {
  id?: number;
  monthlyFinanceId: number;
  totalBalance: number;
  lastUpdate: string;
  monthlyFinance?: MonthlyFinance;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceOverviewsRequest {
  monthlyFinanceId: number;
  totalBalance: number;
  lastUpdate: string;

}

export interface UpdateFinanceOverviewsRequest {
  monthlyFinanceId?: number;
  totalBalance?: number;
  lastUpdate?: string;
 
}

export interface FinanceOverviewsResponse {
  code: number;
  entity: string;
  data: FinanceOverviews;
}

export interface FinanceOverviewsResponses {
  code: number;
  entity: string;
  data: FinanceOverviews[];
}
