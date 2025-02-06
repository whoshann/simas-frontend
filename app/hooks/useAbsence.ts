import { useState, useCallback } from "react";
import { Absence } from "../api/absence/types";
import { absenceApi } from "../api/absence";

export const useAbsence = () => {
  const [absence, setAbsence] = useState<Absence[]>([]);
  const [monthlyAbsences, setMonthlyAbsences] = useState<Absence[]>([]); // Untuk menyimpan absensi bulanan
  const [statistics, setStatistics] = useState<any>(null); // Untuk menyimpan statistik absensi
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

  const fetchMonthlyAbsences = async (studentId: number, year: number, month: number) => {
    try {
      setLoading(true);
      const response = await absenceApi.getMonthlyAbsences(studentId, year, month);
      setMonthlyAbsences(response.data); // Menyimpan absensi bulanan
      setError(null);
    } catch (err) {
      setError("Failed to fetch monthly absences");
      console.error("Error fetching monthly absences:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async (studentId: number, year?: number, month?: number) => {
    try {
      setLoading(true);
      const response = await absenceApi.getStatistics(studentId, year, month);
      setStatistics(response.data); // Menyimpan statistik absensi
      setError(null);
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAbsence = async (
    data: Omit<Absence, "id" | "createdAt" | "updatedAt" | "student">
  ) => {
    try {
      await absenceApi.create(data);
      await fetchAbsence();
    } catch (err) {
      console.error("Error creating absence:", err);
      throw err;
    }
  };

  const updateAbsence = async (id: number, data: Partial<Absence>) => {
    try {
      await absenceApi.update(id, data);
      await fetchAbsence();
    } catch (err) {
      console.error("Error updating absence:", err);
      throw err;
    }
  };

  const deleteAbsence = async (id: number) => {
    try {
      await absenceApi.delete(id);
      await fetchAbsence();
    } catch (err) {
      console.error("Error deleting absence:", err);
      throw err;
    }
  };

  return {
    absence,
    monthlyAbsences,
    statistics,
    loading,
    error,
    fetchAbsence,
    fetchMonthlyAbsences, // Menambahkan fungsi untuk mendapatkan absensi bulanan
    fetchStatistics, // Menambahkan fungsi untuk mendapatkan statistik absensi
    createAbsence,
    updateAbsence,
    deleteAbsence,
  };
};
