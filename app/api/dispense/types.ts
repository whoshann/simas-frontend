import { DispenseStatus } from "@/app/utils/enums";
import { SchoolClass } from "../school-class/types";


interface StudentInDispense {
    id: number;
    name: string;
    
    class: SchoolClass;
  }

export interface Dispense {
    id: number;
    student: StudentInDispense;
    studentId: number;
    reason: string;
    startTime: string;
    endTime: string;
    date: string;
    status: DispenseStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DispenseResponse {
    success: boolean;
    code: string;
    message: string;
    data: Dispense[];
}