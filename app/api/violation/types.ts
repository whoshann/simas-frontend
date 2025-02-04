import { Student } from "../student/types";
import { ViolationPoint } from "../violation-point/types";

interface StudentInViolation {
    id: number;
    name: string;
    class: {
      id: number;
      name: string;
    };
  }

export interface Violation {
    id: number;
    studentId: number;
    violationPointId: number;
    name: string;
    punishment: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    student: StudentInViolation;
    violationPoint: ViolationPoint;
}

export interface ViolationResponse {
    success: boolean;
    code: string;
    message: string;
    data: Violation[];
}