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

  const updateBorrowingStatus = async (id: number) => {
    try {
      setLoading(true);
      await outgoingGoodsApi.updateStatus(id);
      await fetchOutgoingGoods();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal mengupdate status peminjaman';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  return {
    outgoingGoods,
    loading,
    error,
    fetchOutgoingGoods,
    updateBorrowingStatus,
    createOutgoingGoods,
  };
};
