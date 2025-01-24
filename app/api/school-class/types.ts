import { Grade } from "@/app/utils/enums";
import { Major } from "../major/types";
import { Teacher } from "../teacher/types";

export interface SchoolClass {
  id?: number;
  name: string;
  code: string;
  grade: Grade;
  homeroomTeacherId: number;
  majorId: number;
  createdAt: string;
  updatedAt: string;
  homeroomTeacher: Teacher;
  major: Major;
}

export interface SchoolClassResponse {
  success: boolean;
  code: string;
  message: string;
  data: SchoolClass[];
}
