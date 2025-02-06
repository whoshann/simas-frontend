
import { EmployeeGender } from "@/app/utils/enums";
import { EmployeeCategory } from "@/app/utils/enums";

export interface Employee {
  id: number;
  photo?: string;
  fullName: string;
  gender: EmployeeGender;
  placeOfBirth: string;
  dateOfBirth: string;
  fullAddress: string;
  lastEducation: string;
  lastEducationMajor: string;
  phoneNumber: string;
  category: EmployeeCategory;
  maritalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeResponse {
  success: boolean;
  code: string;
  message: string;
  data: Employee[];
}
