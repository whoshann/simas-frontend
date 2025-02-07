import { useState } from "react";
import { Major } from "@/app/api/major/types";
import { majorsApi } from "@/app/api/major";

export const useMajors = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMajors = async () => {
    try {
      setLoading(true);
      const response = await majorsApi.getAll();
      setMajors(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching majors");
      console.error("Error fetching majors:", err);
    } finally {
      setLoading(false);
    }
  };

  const createMajor = async (
    data: Omit<Major, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await majorsApi.create(data);
      await fetchMajors();
    } catch (err) {
      console.error("Error creating news Information:", err);
      throw err;
    }
  };

  const updateMajor = async (id: number, data: Partial<Major>) => {
    try {
      await majorsApi.update(id, data);
      await fetchMajors();
    } catch (err) {
      console.error("Error updating news Information:", err);
      throw err;
    }
  };

  const deleteMajor = async (id: number) => {
    try {
      await majorsApi.delete(id);
      await fetchMajors();
    } catch (err) {
      console.error("Error deleting news Information:", err);
      throw err;
    }
  };


  return {
    majors,
    loading,
    error,
    fetchMajors,
    createMajor,
    updateMajor,
    deleteMajor
  };
};