import { AchievementType } from "@/app/utils/enums";
import { Student } from "../student/types";
import { SchoolClass } from "../school-class/types";

export interface StudentAchievement {
  id: number;
  photo: string;
  achievementName: string;
  competitionName: string;
  typeOfAchievement: AchievementType;
  achievementDate: string;
  studentId: number;
  classId: number;
  student: Student;
  class: SchoolClass;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAchievementResponse {
  success: boolean;
  code: string;
  message: string;
  data: StudentAchievement[];
}
