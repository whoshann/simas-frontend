import { Student } from "../student/types";

export interface PaymentSpp {
    id: number;
    studentId: number;
    amount: number;
    month: string;
    status: string;
    date: string;
    student: Student;
}

export interface PaymentSppResponse {
    success: boolean;
    code: number;
    message: string;
    data: PaymentSpp[];
}
