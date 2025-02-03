export interface StudentClaimInsurance {
    id?: number;
    name: string;
    date: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    
}

export interface StudentClaimInsuranceResponse {
    code: number;
    entity: string;
    data: StudentClaimInsurance;
}

export interface StudentsClaimInsuranceResponse {
    code: number;
    entity: string;
    data: StudentClaimInsurance[];
}
  