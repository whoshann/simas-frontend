import { useState, useCallback } from "react";
import { Student } from "../api/student/types";
import { studentsApi } from "../api/student";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getAll();
      console.log("Students data:", response.data); // Untuk debugging
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data siswa");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = async (
    data: Omit<Student, "id" | "createdAt" | "updatedAt" | "class" | "major">
  ) => {
    try {
      const response = await studentsApi.create(data);
      if (response.success) {
        await fetchStudents(); // Refresh data setelah create
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error("Error creating student:", err);
      throw err;
    }
  };

  const updateStudent = async (
    id: number,
    data: Partial<Omit<Student, "class" | "major">>
  ) => {
    try {
      const response = await studentsApi.update(id, data);
      if (response.success) {
        await fetchStudents(); // Refresh data setelah update
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error("Error updating student:", err);
      throw err;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      await studentsApi.delete(id);
      await fetchStudents(); // Refresh data setelah delete
    } catch (err: any) {
      console.error("Error deleting student:", err);
      throw err;
    }
  };

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
