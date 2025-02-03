import { useState, useCallback } from "react";
import { StudentData } from "../api/students-data/types";
import { studentsdataApi } from "../api/students-data";

export const useStudentsData = () => {
  const [studentsdata, setStudentsData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentsdataApi.getAll();
      setStudentsData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student data");
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudentData = async (data: Omit<StudentData, "id">) => {
    try {
      await studentsdataApi.create(data);
      await fetchStudentsData();
    } catch (err) {
      console.error("Error creating student data", err);
      throw err;
    }
  };

  const updateStudentData = async (id: number, data: Partial<StudentData>) => {
    try {
      await studentsdataApi.update(id, data);
      await fetchStudentsData();
    } catch (err) {
      console.error("Error updating student data:", err);
      throw err;
    }
  };

  const deleteStudentData = async (id: number) => {
    try {
      await studentsdataApi.delete(id);
      await fetchStudentsData();
    } catch (err) {
      console.error("Error deleting student data:", err);
      throw err;
    }
  };

  return {
    studentsdata,
    loading,
    error,
    fetchStudentsData,
    createStudentData,
    updateStudentData,
    deleteStudentData,
  };
};
