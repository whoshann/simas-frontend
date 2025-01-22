import { useState, useCallback } from "react";
import { StudentAchievement } from "../api/student-achievement/types";
import { studentAchievementApi } from "../api/student-achievement";

export const useStudentAchievement = () => {
  const [studentAchievement, setStudentAchievement] = useState<
    StudentAchievement[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentAchievement = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentAchievementApi.getAll();
      setStudentAchievement(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student achievement");
      console.error("Error fetching student achievement:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { studentAchievement, loading, error, fetchStudentAchievement };
};
