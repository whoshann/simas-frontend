import { SchoolClass } from "../school-class/types";
import { Student } from "../student/types";
import { AchievementCategory } from "@/app/utils/enums";

export interface Achievements {
  id: number;
  studentId: number;
  classId: number;
  achievementName: string;
  competitionName: string;
  typeOfAchievement: AchievementCategory;
  picture?: string;
  achievementDate: string;
  createdAt: string;
  updatedAt: string;
  class: SchoolClass;
  student: Student;
}

export interface AchievementsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Achievements[];
}