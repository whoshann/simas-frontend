import { useState, useCallback } from "react";
import { Procurement } from "../api/procurement/types";
import { procurementsApi } from "../api/procurement";

export const useProcurements = () => {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcurements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await procurementsApi.getAll();
      setProcurements(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching procurements:", err);
      setError("Gagal mengambil data procurement");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProcurement = async (formData: FormData) => {
    try {
      await procurementsApi.create(formData);
      await fetchProcurements();
    } catch (err) {
      console.error("Error creating procurement:", err);
      throw err;
    }
  };

  const updateProcurementStatus = async (
    id: number,
    procurementStatus: string,
    updateMessage: string
) => {
    try {
        setLoading(true);
        await procurementsApi.updateStatus(id.toString(), {
            procurementStatus,
            updateMessage
        });
        await fetchProcurements();
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Gagal mengupdate status pengajuan';
        throw new Error(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return {
    procurements,
    loading,
    error,
    fetchProcurements,
    createProcurement,
    updateProcurementStatus,
  };
};
