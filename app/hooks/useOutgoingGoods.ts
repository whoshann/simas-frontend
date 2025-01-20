import { useCallback, useState } from "react";
import { outgoingGoodsApi } from "@/app/api/outgoing-goods";
import {
  OutgoingGoods,
  OutgoingGoodsRequest,
} from "@/app/api/outgoing-goods/types";

interface ApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: OutgoingGoods[];
}

export const useOutgoingGoods = () => {
  const [outgoingGoods, setOutgoingGoods] = useState<OutgoingGoods[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOutgoingGoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await outgoingGoodsApi.getAll();
      const apiResponse = response as unknown as ApiResponse;

      console.log("Response dari API:", apiResponse);
      console.log("Data yang akan disimpan:", apiResponse.data);

      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        setOutgoingGoods(apiResponse.data);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError("Failed to fetch outgoing goods");
      console.error("Error fetching outgoing goods:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOutgoingGoods = async (data: Partial<OutgoingGoods>) => {
    try {
      const response = await outgoingGoodsApi.create(
        data as unknown as OutgoingGoodsRequest
      );
      const apiResponse = response as unknown as ApiResponse;
      if (apiResponse.success) {
        await fetchOutgoingGoods(); // Refresh data after creation
        return apiResponse.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const updateOutgoingGoods = async (
    id: number,
    data: Partial<OutgoingGoods>
  ) => {
    try {
      const response = await outgoingGoodsApi.update(
        id,
        data as unknown as OutgoingGoodsRequest
      );
      const apiResponse = response as unknown as ApiResponse;
      if (apiResponse.success) {
        await fetchOutgoingGoods(); // Refresh data after update
        return apiResponse.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteOutgoingGoods = async (id: number) => {
    try {
      const response = await outgoingGoodsApi.delete(id);
      const apiResponse = response as unknown as ApiResponse;
      if (apiResponse.success) {
        await fetchOutgoingGoods(); // Refresh data after deletion
        return apiResponse.data;
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    outgoingGoods,
    loading,
    error,
    fetchOutgoingGoods,
    createOutgoingGoods,
    updateOutgoingGoods,
    deleteOutgoingGoods,
  };
};
