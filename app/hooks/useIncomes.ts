import { useState, useEffect } from "react";
import { IncomesApi } from "@/app/api/incomes";
import {
  Income,
  CreateIncomeDto,
  UpdateIncomeDto,
} from "@/app/api/incomes/types";

export const useIncome = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await IncomesApi.getAll();
      setIncomes(response.data);
    } catch (err) {
      setError("Gagal mengambil data income");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (formData: Omit<Income, "id">) => {
    try {
      const response = await IncomesApi.create(formData);
      await fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      throw error;
    }
  };

  const updateIncome = async (id: number, formData: Partial<Income>) => {
    try {
      await IncomesApi.update(id, formData);
      await fetchIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
      throw error;
    }
  };

  const deleteIncome = async (id: number) => {
    try {
      await IncomesApi.delete(id);
      await fetchIncomes();
    } catch (err) {
      setError("Gagal menghapus income");
      throw err;
    }
  };

  const getIncomeById = async (id: number) => {
    try {
      setLoading(true);
      const response = await IncomesApi.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error getting income:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return {
    incomes,
    loading,
    error,
    addIncome,
    updateIncome,
    fetchIncomes,
    deleteIncome,
    refetch: fetchIncomes,
    getIncomeById,
  };
};
