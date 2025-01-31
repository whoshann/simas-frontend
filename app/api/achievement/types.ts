import { SchoolClass } from "../school-class/types";
import { Student } from "../student/types";
import { AchievementCategory } from "@/app/utils/enums";

export interface Achievements {
  id: number;
  photo?: string;
  achievementName: string;
  competitionName: string;
  typeOfAchievement: AchievementCategory;
  achievementDate: string;
  studentId: number;
  classId: number;
  class: SchoolClass;
  student: Student;
}

export interface AchievementResponse {
  success: boolean;
  code: string;
  message: string;
  data: Achievements;
}


export interface AchievementsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Achievements[];
}

export interface CreateAchievementDto {
  achievementName: string;
  competitionName: string;
  typeOfAchievement: 'ACADEMIC' | 'NON_ACADEMIC';
  achievementDate: Date;
  studentId: number;
  classId: number;
  photo?: string;
}