import { useState, useCallback } from "react";
import {
  Income,
  IncomesRequest,
  UpdateIncomesRequest,
} from "../api/incomes/types";
import { incomeApi } from "../api/incomes";

export const useIncome = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await incomeApi.getAll();
      setIncomes(response.data);
      setError(null);
      return response.data; // Tambahkan return untuk mengembalikan data
    } catch (err) {
      setError("Gagal mengambil data pendapatan");
      console.error("Error fetching incomes:", err);
      return []; // Return array kosong jika terjadi error
    } finally {
      setLoading(false);
    }
  }, []);

  const createIncomes = async (data: IncomesRequest) => {
    try {
      await incomeApi.create(data);
      await fetchIncomes();
    } catch (err) {
      console.error("Error creating income:", err);
      throw err;
    }
  };

  const updateIncomes = async (id: number, data: UpdateIncomesRequest) => {
    try {
      await incomeApi.update(id, data);
      await fetchIncomes();
    } catch (err) {
      console.error("Error updating incomes", err);
      throw err;
    }
  };

  const deleteIncomes = async (id: number) => {
    try {
      await incomeApi.delete(id);
      await fetchIncomes();
    } catch (err) {
      console.error("Error deleting incomes", err);
      throw err;
    }
  };

  return {
    incomes,
    loading,
    error,
    fetchIncomes,
    createIncomes,
    updateIncomes,
    deleteIncomes,
  };
};
