import { useState, useCallback } from "react";
import { FinanceOverview, FinanceOverviewResponse } from "../api/finance-overview/types";
import { financeOverviewApi } from "../api/finance-overview";

export const useFinanceOverview = () => {
  const [financeOverview, setFinanceOverview] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response: FinanceOverviewResponse = await financeOverviewApi.getOverview();
      setFinanceOverview(response.data); // Sekarang response.data adalah single object
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching Finance Overview");
      console.error("Error fetching Finance Overview:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { financeOverview, loading, error, fetchFinanceOverview };
};