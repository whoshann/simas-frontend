import { useState } from 'react';
import { StudentAchievement } from '@/app/api/student-achievements/types';
import { studentAchievementsApi } from '@/app/api/student-achievements';

export const useStudentAchievements = () => {
    const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentsAchievements = async () => {
        try {
            setLoading(true);
            const response = await studentAchievementsApi.getAll();
            setStudentAchievements(response.data as StudentAchievement[]);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const createStudentAchievement = async (data: Omit<StudentAchievement, 'id'>) => {
        try {
            const response = await studentAchievementsApi.create(data);
            setStudentAchievements((prev) => [...prev, response.data as StudentAchievement]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating student:', err);
            throw err;
        }
    };

    const updateStudentAchievement = async (id: number, data: Partial<StudentAchievement>) => {
        try {
            const response = await studentAchievementsApi.update(id, data);
            setStudentAchievements((prev) =>
                prev.map((studentAchievement) =>
                    studentAchievement.id === id ? { ...studentAchievement, ...response.data } : studentAchievement
                )
            );
            return response.data;
        } catch (err: any) {
            console.error('Error updating student:', err);
            throw err;
        }
    };

    const deleteStudentAchievement = async (id: number) => {
        try {
            await studentAchievementsApi.delete(id);
            setStudentAchievements((prev) =>
                prev.filter((studentAchievement) => studentAchievement.id !== id)
            );
        } catch (err: any) {
            console.error('Error deleting student:', err);
            throw err;
        }
    };

    return {
        studentAchievements,
        loading,
        error,
        fetchStudentsAchievements,
        createStudentAchievement,
        updateStudentAchievement,
        deleteStudentAchievement,
    };
};
