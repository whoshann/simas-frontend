import { useState } from "react";
import { Subject } from "@/app/api/subject/types";
import { subjectsApi } from "@/app/api/subject/index";

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectsApi.getAll();
      setSubjects(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching subjects");
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (data: Omit<Subject, "id">) => {
    try {
      const response = await subjectsApi.create(data);
      setSubjects([...subjects, response.data]);
      return response.data;
    } catch (err: any) {
      console.error("Error creating subject:", err);
      throw err;
    }
  };

  const updateSubject = async (id: number, data: Partial<Subject>) => {
    try {
      const response = await subjectsApi.update(id, data);
      setSubjects(
        subjects.map((subject) => (subject.id === id ? response.data : subject))
      );
      return response.data;
    } catch (err: any) {
      console.error("Error updating subject:", err);
      throw err;
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      await subjectsApi.delete(id);
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } catch (err: any) {
      console.error("Error deleting subject:", err);
      throw err;
    }
  };

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
