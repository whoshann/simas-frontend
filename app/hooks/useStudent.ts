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
      setStudents(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (
    data: Omit<Student, "id" | "createdAt" | "updatedAt" | "Class" | "Major" | "track" | "admissionYear" | "religion">
  ) => {
    try {
      await studentsApi.create(data);
      await fetchStudents();
    } catch (err) {
      console.error("Error creating news Information:", err);
      throw err;
    }
  };

  const updateStudent = async (id: number, data: Partial<Student>) => {
    try {
      await studentsApi.update(id, data);
      await fetchStudents();
    } catch (err) {
      console.error("Error updating news Information:", err);
      throw err;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      await studentsApi.delete(id);
      await fetchStudents();
    } catch (err) {
      console.error("Error deleting news Information:", err);
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
    deleteStudent
  };
};