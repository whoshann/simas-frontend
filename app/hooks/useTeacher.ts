import { useState } from "react";
import { Teacher } from "@/app/api/teacher/types";
import { teachersApi } from "@/app/api/teacher";

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersApi.getAll();
      setTeachers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
  };
};
