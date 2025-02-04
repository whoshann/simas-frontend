import { useState, useCallback } from "react";
import { Absence } from "../api/absence/types";
import { absenceApi } from "../api/absence";

export const useAbsence = () => {
  const [absence, setAbsence] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbsence = useCallback(async () => {
    try {
      setLoading(true);
      const response = await absenceApi.getAll();
      const processedData = response.data.map((news: Absence) => ({
        ...news,
        photo: news.photo ?? "", // Gunakan string kosong jika null
      }));

      setAbsence(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch absence");
      console.error("Error fetching absence:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAbsence = async (
    data: Omit<Absence, "id" | "createdAt" | "updatedAt" | "student">
  ) => {
    try {
      await absenceApi.create(data);
      await fetchAbsence();
    } catch (err) {
      console.error("Error creating news Information:", err);
      throw err;
    }
  };

  const updateAbsence = async (id: number, data: Partial<Absence>) => {
    try {
      await absenceApi.update(id, data);
      await fetchAbsence();
    } catch (err) {
      console.error("Error updating news Information:", err);
      throw err;
    }
  };

  const deleteAbsence = async (id: number) => {
    try {
      await absenceApi.delete(id);
      await fetchAbsence();
    } catch (err) {
      console.error("Error deleting news Information:", err);
      throw err;
    }
  };

  return { absence, loading, error, fetchAbsence, createAbsence, updateAbsence, deleteAbsence };
};
