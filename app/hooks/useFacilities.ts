import { useState, useCallback } from "react";
import { Facility } from "../api/facilities/types";
import { facilitiesApi } from "../api/facilities";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "../utils/sweetAlert";

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await facilitiesApi.getAll();
      setFacilities(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch facilities");
      console.error("Error fetching facilities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFacility = async (data: Omit<Facility, "id">) => {
    try {
      await facilitiesApi.create(data);
      await fetchFacilities();
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  };

  const updateFacility = async (id: number, data: Partial<Facility>) => {
    try {
      await facilitiesApi.update(id, data);
      await fetchFacilities();
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteFacility = async (id: number) => {
    try {

      const isConfirmed = await showConfirmDelete(
        'Hapus Data Perbaikan',
        'Apakah Anda yakin ingin menghapus data perbaikan ini?'
      );

      if (isConfirmed) {
        await facilitiesApi.delete(id);
        await fetchFacilities();
        await showSuccessAlert('Berhasil', 'Data perbaikan berhasil dihapus');
      }
    } catch (err) {
      console.error("Error deleting repair:", err);
      await showErrorAlert('Error', 'Gagal menghapus data perbaikan');
      throw err;
    }
  };


 
  return {
    facilities,
    loading,
    error,
    fetchFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
  };
};
