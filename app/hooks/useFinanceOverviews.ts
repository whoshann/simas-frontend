import { useState, useCallback } from "react";
import {
  FinanceOverviews,
  FinanceOverviewsRequest,
  UpdateFinanceOverviewsRequest,
} from "../api/finance-overviews/types";
import { financeoverviewsApi } from "../api/finance-overviews";

export const useFinanceOverviews = () => {
  const [financeOverviews, setFinanceOverviews] = useState<FinanceOverviews[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceOverviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await financeoverviewsApi.getAll();
      setFinanceOverviews(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch finance overview");
      console.error("Error fetching finance overview:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFinanceOverviews = async (data: FinanceOverviewsRequest) => {
    try {
      await financeoverviewsApi.create(data);
      await fetchFinanceOverviews();
    } catch (err) {
      console.error("Error creating finance overview:", err);
      throw err;
    }
  };

  const updateFinanceOverviews = async (
    id: number,
    data: UpdateFinanceOverviewsRequest
  ) => {
    try {
      await financeoverviewsApi.update(id, data);
      await fetchFinanceOverviews();
    } catch (err) {
      console.error("Error updating finance overview:", err);
      throw err;
    }
  };

  const deleteFinanceOverviews = async (id: number) => {
    try {
      await financeoverviewsApi.delete(id);
      await fetchFinanceOverviews();
    } catch (err) {
      console.error("Error deleting finance overview:", err);
      throw err;
    }
  };

  return {
    financeOverviews,
    loading,
    error,
    fetchFinanceOverviews,
    createFinanceOverviews,
    updateFinanceOverviews,
    deleteFinanceOverviews,
  };
};
