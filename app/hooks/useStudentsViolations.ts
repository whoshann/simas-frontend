import { useState, useCallback } from "react";
import { StudentViolations } from "../api/students-violations/types";
import { studentsviolationsApi } from "../api/students-violations";

export const useStudentsViolations = () => {
  const [studentsviolations, setStudentsViolations] = useState<StudentViolations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsViolations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentsviolationsApi.getAll();
      setStudentsViolations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student violations");
      console.error("Error fetching student violations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudentViolations = async (data: Omit<StudentViolations, "id">) => {
    try {
      await studentsviolationsApi.create(data);
      await fetchStudentsViolations();
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  };

  const updateStudentViolations = async (id: number, data: Partial<StudentViolations>) => {
    try {
      await studentsviolationsApi.update(id, data);
      await fetchStudentsViolations();
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteStudentViolations = async (id: number) => {
    try {
      await studentsviolationsApi.delete(id);
      await fetchStudentsViolations();
    } catch (err) {
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  return {
    studentsviolations,
    loading,
    error,
    fetchStudentsViolations,
    createStudentViolations,
    updateStudentViolations,
    deleteStudentViolations,
  };
};
