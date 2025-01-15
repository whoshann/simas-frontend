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

  const addInventory = async (data: CreateInventoryDto) => {
    try {
      await inventoryApi.create(data);
      await fetchInventories();
    } catch (err) {
      setError("Gagal menambah inventory");
      throw err;
    }
  };

  const updateInventory = async (id: number, data: UpdateInventoryDto) => {
    try {
      await inventoryApi.update(id, data);
      await fetchInventories();
    } catch (err) {
      setError("Gagal mengupdate inventory");
      throw err;
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
  };
};
