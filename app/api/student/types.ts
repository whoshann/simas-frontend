import { Gender, Religion } from "@/app/utils/enums";
import { Major } from "../major/types";
import { SchoolClass } from "../school-class/types";

export interface Student {
  id: number;
  nis: string;
  nisn: string;
  name: string;
  gender: Gender;
  birthDate: string;
  birthPlace: string;
  address: string;
  phone: string;
  parentPhone: string;
  classId: number;
  religion: Religion;
  fatherName: string;
  motherName: string;
  guardian: string;
  majorId: number;
  track: string;
  admissionYear: number;
  createdAt: string;
  updatedAt: string;
  class: SchoolClass;
  major: Major;
}

export interface StudentsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Student[];
}

export interface StudentResponse {
  success: boolean;
  code: string;
  message: string;
  data: Student;
}
