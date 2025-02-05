export interface PaymentSpp {
    id?: number;
    name: string;
    quantity: string;
    month: number;
    status: string;
    transactionId: string;
    date: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface PaymentSppResponse {
    success: boolean;
    code: string;
    message: string;
    data: PaymentSpp[];
  }