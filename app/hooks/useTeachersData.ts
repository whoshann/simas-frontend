import { useState, useCallback } from "react";
import { TeacherData } from "../api/teachers-data/types";
import { teachersdataApi } from "../api/teachers-data";

export const useTeachersData = () => {
  const [teachersdata, setTeachersData] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachersData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teachersdataApi.getAll();
      setTeachersData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Teacher data");
      console.error("Error fetching Teacher data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeacherData = async (data: Omit<TeacherData, "id">) => {
    try {
      await teachersdataApi.create(data);
      await fetchTeachersData();
    } catch (err) {
      console.error("Error creating Teacher data", err);
      throw err;
    }
  };

  const updateTeacherData = async (id: number, data: Partial<TeacherData>) => {
    try {
      await teachersdataApi.update(id, data);
      await fetchTeachersData();
    } catch (err) {
      console.error("Error updating Teacher data:", err);
      throw err;
    }
  };

  const deleteTeacherData = async (id: number) => {
    try {
      await teachersdataApi.delete(id);
      await fetchTeachersData();
    } catch (err) {
      console.error("Error deleting Teacher data:", err);
      throw err;
    }
  };

  return {
    teachersdata,
    loading,
    error,
    fetchTeachersData,
    createTeacherData,
    updateTeacherData,
    deleteTeacherData,
  };
};
