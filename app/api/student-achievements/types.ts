export interface StudentAchievement {
    id?: number;
    name: string;
    classSchool: string;
    achievement: string;
    category: string;
    photo?: string | null;
    date?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentAchievementResponse {
    code: number;
    entity: string;
    data: StudentAchievement;
}

export interface StudentAchievementsResponse {
    code: number;
    entity: string;
    data: StudentAchievement[];
}
  