import { useState, useEffect } from "react";
import { monthlyFinanceApi } from "@/app/api/monthly-finances";
import {
  MonthlyFinance,
  CreateMonthlyFinanceDto,
  UpdateMonthlyFinanceDto,
} from "@/app/api/monthly-finances/types";

export const useMonthlyFinance = () => {
  const [monthlyFinances, setMonthlyFinances] = useState<MonthlyFinance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyFinances = async () => {
    try {
      setLoading(true);
      const response = await monthlyFinanceApi.getAll();
      setMonthlyFinances(response.data);
    } catch (err) {
      setError("Gagal mengambil data MonthlyFinance");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMonthlyFinance = async (formData: FormData) => {
    try {
      const response = await monthlyFinanceApi.create(formData);
      await fetchMonthlyFinances();
    } catch (error) {
      console.error("Error adding monthly finance:", error);
      throw error;
    }
  };

  const updateMonthlyFinance = async (id: number, formData: FormData) => {
    try {
      await monthlyFinanceApi.update(id, formData);
      await fetchMonthlyFinances();
    } catch (error) {
      console.error("Error updating monthly finance:", error);
      throw error;
    }
  };

  const deleteMonthlyFinance = async (id: number) => {
    try {
      await monthlyFinanceApi.delete(id);
      await fetchMonthlyFinances();
    } catch (err) {
      setError("Gagal menghapus monthly finance");
      throw err;
    }
  };

  const getMonthlyFinanceById = async (id: number) => {
    try {
      setLoading(true);
      const response = await monthlyFinanceApi.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error getting monthly finance:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyFinances();
  }, []);

  return {
    monthlyFinances,
    loading,
    error,
    addMonthlyFinance,
    updateMonthlyFinance,
    fetchMonthlyFinances,
    deleteMonthlyFinance,
    refetch: fetchMonthlyFinances,
    getMonthlyFinanceById,
  };
};
