import { Student } from "../student/types";
import { ViolationPoint } from "../violation-point/types";
 
export interface Violation {
  id: number;
  studentId: number;
  violationPointId: number;
  date: string;
  name: string;
  punishment: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  violationPoint: ViolationPoint;
}

export interface ViolationResponse {
  success: boolean;
  code: string;
  message: string;
  data: Violation[];
}
