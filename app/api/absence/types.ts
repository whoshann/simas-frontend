import { AbsenceStatus } from "@/app/utils/enums";
import { Student } from "../student/types";

export interface Absence {
  id: number;
  classId: number;
  studentId: number;
  date: string;
  status: AbsenceStatus;
  note: string | null;
  latitude: number | null;
  longtitude: number | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
  Student: Student;
}

export interface AbsenceResponse {
  success: boolean;
  code: string;
  message: string;
  data: Absence[];
}
