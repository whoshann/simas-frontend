import { useState, useCallback } from "react";
import { Expense } from "../api/expenses/types";
import { expensesApi } from "../api/expenses";

export const useExpenses = () => {
  const [Expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (): Promise<{ amount: number }[]> => {
    try {
      setLoading(true);
      const response = await expensesApi.getAll();
      setExpenses(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to fetch Expenses");
      console.error("Error fetching Expenses:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = async (data: Omit<Expense, "id"> & { monthlyFinanceId: number; expensedate: string }) => {
    try {
      await expensesApi.create(data);
      await fetchExpenses();
    } catch (err) {
      console.error("Error creating Expense:", err);
      throw err;
    }
  };

  const updateExpense = async (id: number, data: Partial<Expense>) => {
    try {
      await expensesApi.update(id, data);
      await fetchExpenses();
    } catch (err) {
      console.error("Error updating Expense:", err);
      throw err;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await expensesApi.delete(id);
      await fetchExpenses();
    } catch (err) {
      console.error("Error deleting Expense:", err);
      throw err;
    }
  };

  return {
    Expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
