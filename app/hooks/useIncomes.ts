import { useState, useCallback } from "react";
import { Income } from "../api/incomes/types";
import { incomesApi } from "../api/incomes";
import { showSuccessAlert, showErrorAlert, showConfirmDelete } from "@/app/utils/sweetAlert";

export const useIncomes = () => {
  const [Incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async (): Promise<{ amount: number }[]> => {
    try {
      setLoading(true);
      const response = await incomesApi.getAll();
      setIncomes(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to fetch Incomes");
      console.error("Error fetching Incomes:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createIncome = async (data: Omit<Income, "id"> & { monthlyFinanceId: number; incomedate: string }) => {
    try {
      await incomesApi.create(data);
      await fetchIncomes();
    } catch (err) {
      console.error("Error creating Incomes:", err);
      throw err;
    }
  };

  const updateIncome = async (id: number, data: Partial<Income>) => {
    try {
      await incomesApi.update(id, data);
      await fetchIncomes();
    } catch (err) {
      console.error("Error updating Incomes:", err);
      throw err;
    }
  };

  const deleteIncome = async (id: number) => {
    try {

      const isConfirmed = await showConfirmDelete(
        'Hapus Data Pemasukan',
        'Apakah Anda yakin ingin menghapus data pemasukan ini?'
      );

      if (isConfirmed) {
        await incomesApi.delete(id);
        await fetchIncomes();
        await showSuccessAlert('Berhasil', 'Data pemasukan berhasil dihapus');
      }
    } catch (err) {
      console.error("Error deleting income:", err);
      await showErrorAlert('Error', 'Gagal menghapus data pemasukan');
      throw err;
    }
  };

  return {
    Incomes,
    loading,
    error,
    fetchIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
  };
};
