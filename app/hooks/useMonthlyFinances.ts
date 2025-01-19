import { useState, useEffect } from "react";
import { MonthlyFinanceApi } from "@/app/api/monthly-finances";

export const useMonthlyFinances = () => {
  const [monthlyFinances, setMonthlyFinances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyFinances = async () => {
    try {
      setLoading(true);
      const response = await MonthlyFinanceApi.getAll();
      setMonthlyFinances(response.data);
    } catch (err) {
      setError("Gagal mengambil data keuangan bulanan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomes = async () => {
    // Implementasi untuk mengambil data income
  };

  const fetchExpenses = async () => {
    // Implementasi untuk mengambil data expense
  };

  useEffect(() => {
    fetchMonthlyFinances();
  }, []);

  return {
    monthlyFinances,
    loading,
    error,
    fetchMonthlyFinances,
  };
};
