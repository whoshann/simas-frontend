import { Gender, Religion } from "@/app/utils/enums";
import { Major } from "../major/types";
import { SchoolClass } from "../school-class/types";

export interface Student {
  id: number;
  name: string;
  classId: number;
  majorId: number;
  nis: string;
  nisn: string;
  gender: Gender;
  birthDate: string;
  birthPlace: string;
  address: string;
  phone: string;
  parentPhone: string;
  religion: Religion;
  motherName: string;
  fatherName: string;
  guardian: string;
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
