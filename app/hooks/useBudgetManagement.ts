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
      const processedData = response.data.map((budget: BudgetManagement) => ({
        ...budget,
      }));

      setBudgetManagement(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news information");
      console.error("Error fetching news information:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { budgetManagement, loading, error, fetchBudgetManagement };
};