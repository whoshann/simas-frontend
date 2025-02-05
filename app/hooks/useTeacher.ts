import { useState } from "react";
import { Teachers } from "@/app/api/teacher/types";
import { teachersApi } from "@/app/api/teacher";

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersApi.getAll();
      const processedData = response.data.map((news: Teachers) => ({
        ...news,
        picture: news.picture ?? "", // Gunakan string kosong jika null
      }));

      setTeachers(processedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTeachers = async (
    data: Omit<Teachers, "id" | "createdAt" | "updatedAt" | "TeacherRole">
  ) => {
    try {
      await teachersApi.create(data);
      await fetchTeachers();
    } catch (err) {
      console.error("Error creating news Information:", err);
      throw err;
    }
  };

  const updateTeachers = async (id: number, data: Partial<Teachers>) => {
    try {
      await teachersApi.update(id, data);
      await fetchTeachers();
    } catch (err) {
      console.error("Error updating news Information:", err);
      throw err;
    }
  };

  const deleteTeachers = async (id: number) => {
    try {
      await teachersApi.delete(id);
      await fetchTeachers();
    } catch (err) {
      console.error("Error deleting news Information:", err);
      throw err;
    }
  };

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeachers,
    updateTeachers,
    deleteTeachers
  };
};
