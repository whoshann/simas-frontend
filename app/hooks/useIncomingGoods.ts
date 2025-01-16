import { useState, useCallback } from "react";
import {
  IncomingGoods,
  IncomingGoodsRequest,
  UpdateIncomingGoodsRequest,
} from "../api/incoming-goods/types";
import { incomingGoodsApi } from "../api/incoming-goods";

export const useIncomingGoods = () => {
  const [incomingGoods, setIncomingGoods] = useState<IncomingGoods[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomingGoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await incomingGoodsApi.getAll();
      setIncomingGoods(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch incoming goods");
      console.error("Error fetching incoming goods:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createIncomingGoods = async (data: IncomingGoodsRequest) => {
    try {
      await incomingGoodsApi.create(data);
      await fetchIncomingGoods();
    } catch (err) {
      console.error("Error creating incoming goods:", err);
      throw err;
    }
  };

  const updateIncomingGoods = async (
    id: number,
    data: UpdateIncomingGoodsRequest
  ) => {
    try {
      await incomingGoodsApi.update(id, data);
      await fetchIncomingGoods();
    } catch (err) {
      console.error("Error updating incoming goods:", err);
      throw err;
    }
  };

  const deleteIncomingGoods = async (id: number) => {
    try {
      await incomingGoodsApi.delete(id);
      await fetchIncomingGoods();
    } catch (err) {
      console.error("Error deleting incoming goods:", err);
      throw err;
    }
  };

  return {
    incomingGoods,
    loading,
    error,
    fetchIncomingGoods,
    createIncomingGoods,
    updateIncomingGoods,
    deleteIncomingGoods,
  };
};
