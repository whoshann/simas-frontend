import { useState, useCallback } from "react";
import { BudgetManagement } from "../api/budget-management/types";
import { budgetManagementApi } from "../api/budget-management";

export const useBudgetManagement = () => {
  const [budgetManagement, setBudgetManagement] = useState<BudgetManagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgetManagement = useCallback(async () => {
    try {
      setLoading(true);
      const response = await budgetManagementApi.getAll();
      setBudgetManagement(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch budget management");
      console.error("Error fetching budget management:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBudgetStatus = async (
    id: number,
    status: string,
    updateMessage: string
  ) => {
    try {
      setLoading(true);
      await budgetManagementApi.updateStatus(id, { status, updateMessage });
      await fetchBudgetManagement(); // Refresh data setelah update
    } catch (err) {
      console.error("Error updating budget status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { budgetManagement, loading, error, fetchBudgetManagement, updateBudgetStatus };
};