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

  return {
    students,
    loading,
    error,
    fetchStudents,
  };
};