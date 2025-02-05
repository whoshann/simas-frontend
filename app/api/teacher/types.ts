import { TeacherRole } from './../../utils/enums';
import { Gender } from "@/app/utils/enums";
import { Position } from "../position/types";
import { Subject } from "../subject/types";

export interface Teachers {
  id: number;
  picture?: string;
  nip: string;
  role: TeacherRole;
  name: string;
  gender: Gender;
  placeOfBirth: string;
  birthDate: string;
  address: string;
  phone: string;
  lastEducation: string;
  lastEducationMajor: string;
  subjectId: number;
  positionId: number;
  subject: Subject;
  position: Position;
  createdAt: string;
  updatedAt: string;
}

export interface TeachersResponse {
  success: boolean;
  code: string;
  message: string;
  data: Teachers[];
}
