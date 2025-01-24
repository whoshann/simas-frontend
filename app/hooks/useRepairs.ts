import { useState, useCallback } from "react";
import { Repairs } from "../api/repairs/types";
import { repairsApi } from "../api/repairs";

export const useRepairs = () => {
  const [repairs, setRepairs] = useState<Repairs[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await repairsApi.getAll();
      console.log("Repairs data:", response.data); // Untuk debugging
      setRepairs(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching repairs:", err);
      setError("Gagal mengambil data perbaikan");
    } finally {
      setLoading(false);
    }
  }, []);

  const createRepair = async (
    data: Omit<Repairs, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await repairsApi.create(data);
      await fetchRepairs();
    } catch (err) {
      console.error("Error creating repair:", err);
      throw err;
    }
  };

  const updateRepair = async (id: number, data: Partial<Repairs>) => {
    try {
      await repairsApi.update(id, data);
      await fetchRepairs();
    } catch (err) {
      console.error("Error updating repair:", err);
      throw err;
    }
  };

  const deleteRepair = async (id: number) => {
    try {
      await repairsApi.delete(id);
      await fetchRepairs();
    } catch (err) {
      console.error("Error deleting repair:", err);
      throw err;
    }
  };

  return {
    repairs,
    loading,
    error,
    fetchRepairs,
    createRepair,
    updateRepair,
    deleteRepair,
  };
};
