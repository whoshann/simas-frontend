import { useState, useCallback } from "react";
import { MaintenanceRecord } from "../api/maintenance-records/types";
import { MaintenanceRecordsApi } from "../api/maintenance-records";

export const useMaintenanceRecords = () => {
  const [MaintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MaintenanceRecordsApi.getAll();
      setMaintenanceRecords(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch maintenance record");
      console.error("Error fetching maintenance record:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaintenanceRecord = async (data: Omit<MaintenanceRecord, "id">) => {
    try {
      await MaintenanceRecordsApi.create(data);
      await fetchMaintenanceRecords();
    } catch (err) {
      console.error("Error creating maintenance record:", err);
      throw err;
    }
  };

  const updateMaintenanceRecord = async (id: number, data: Partial<MaintenanceRecord>) => {
    try {
      await MaintenanceRecordsApi.update(id, data);
      await fetchMaintenanceRecords();
    } catch (err) {
      console.error("Error updating maintenance recorf:", err);
      throw err;
    }
  };

  const deleteMaintenanceRecord = async (id: number) => {
    try {
      await MaintenanceRecordsApi.delete(id);
      await fetchMaintenanceRecords();
    } catch (err) {
      console.error("Error deleting maintenance record:", err);
      throw err;
    }
  };

  return {
    MaintenanceRecords,
    loading,
    error,
    fetchMaintenanceRecords,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
  };
};
