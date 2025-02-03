export interface Income {
  id?: number;
  monthlyFinanceId: number;
  source: string;
  description?: string;
  amount: number;
  incomeDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIncomeDto {
  monthlyFinanceId: number;
  source: string;
  description?: string;
  amount: number;
  incomeDate: string;
}

export interface UpdateIncomeDto extends Partial<CreateIncomeDto> {}

export interface IncomeResponse {
  code: number;
  entity: string;
  data: Income;
}

export interface IncomesResponse {
  code: number;
  entity: string;
  data: Income[];
}
