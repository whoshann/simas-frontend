import { useState, useCallback } from "react";
import { StudentAchievement } from "../api/student-achievements/types";
import { studentachievementsApi } from "../api/student-achievements";

export const useStudentAchievements = () => {
  const [studentachievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentachievementsApi.getAll();
      setStudentAchievements(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student achievements");
      console.error("Error fetching student achievements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudentAchievement = async (data: Omit<StudentAchievement, "id">) => {
    try {
      await studentachievementsApi.create(data);
      await fetchStudentAchievements();
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  };

  const updateStudentAchievement = async (id: number, data: Partial<StudentAchievement>) => {
    try {
      await studentachievementsApi.update(id, data);
      await fetchStudentAchievements();
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteStudentAchievement = async (id: number) => {
    try {
      await studentachievementsApi.delete(id);
      await fetchStudentAchievements();
    } catch (err) {
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  return {
    studentachievements,
    loading,
    error,
    fetchStudentAchievements,
    createStudentAchievement,
    updateStudentAchievement,
    deleteStudentAchievement,
  };
};
