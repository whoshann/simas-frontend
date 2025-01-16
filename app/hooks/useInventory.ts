import { useState, useEffect } from "react";
import { inventoryApi } from "@/app/api/inventories";
import {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/app/api/inventories/types";

export const useInventory = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getAll();
      setInventories(response.data);
    } catch (err) {
      setError("Gagal mengambil data inventory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addInventory = async (formData: FormData) => {
    try {
      const response = await inventoryApi.create(formData);
      await fetchInventories();
    } catch (error) {
      console.error("Error adding inventory:", error);
      throw error;
    }
  };

  const updateInventory = async (id: number, formData: FormData) => {
    try {
      await inventoryApi.update(id, formData);
      await fetchInventories();
    } catch (error) {
      console.error("Error updating inventory:", error);
      throw error;
    }
  };

  const deleteInventory = async (id: number) => {
    try {
      await inventoryApi.delete(id);
      await fetchInventories();
    } catch (err) {
      setError("Gagal menghapus inventory");
      throw err;
    }
  };

  const getInventoryById = async (id: number) => {
    try {
      setLoading(true);
      const response = await inventoryApi.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error getting inventory:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return {
    inventories,
    loading,
    error,
    addInventory,
    updateInventory,
    deleteInventory,
    refetch: fetchInventories,
    getInventoryById,
  };
};
