import { useState } from "react";
import { Student } from "../api/student/types";
import { studentsApi } from "../api/student";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getAll();
      if (response.success) {
        setStudents(response.data);
        setError(null);
      } else {
        setError(response.message || "Error fetching students");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (
    data: Omit<Student, "id" | "createdAt" | "updatedAt" | "Class" | "Major">
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
    data: Partial<Omit<Student, "Class" | "Major">>
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
