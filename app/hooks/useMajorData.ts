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

  return {
    majors,
    loading,
    error,
    fetchMajors,
  };
};