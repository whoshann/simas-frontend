import { useState, useCallback } from "react";
import { PaymentSpp } from "../api/payment-spp/types";
import { paymentSppApi } from "../api/payment-spp";

export const usePaymentSpp = () => {
  const [paymentSpp, setPaymentSpp] = useState<PaymentSpp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentSpp = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentSppApi.getAll();
      const processedData = response.data.map((payment: PaymentSpp) => ({
        ...payment,
      }));

      setPaymentSpp(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payment spp");
      console.error("Error fetching payment spp:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaymentSpp = async (
      data: Omit<PaymentSpp, "id" | "createdAt" | "updatedAt">
    ) => {
      try {
        await paymentSppApi.create(data);
        await fetchPaymentSpp();
      } catch (err) {
        console.error("Error creating payment spp:", err);
        throw err;
      }
    };
  
    const updatePaymentSpp = async (id: number, data: Partial<PaymentSpp>) => {
      try {
        await paymentSppApi.update(id, data);
        await fetchPaymentSpp();
      } catch (err) {
        console.error("Error updating payment spp:", err);
        throw err;
      }
    };
  
    const deletePaymentSpp = async (id: number) => {
      try {
        await paymentSppApi.delete(id);
        await fetchPaymentSpp();
      } catch (err) {
        console.error("Error deleting payment spp:", err);
        throw err;
      }
    };

  return { paymentSpp, createPaymentSpp, updatePaymentSpp, deletePaymentSpp, loading, error, fetchPaymentSpp };
};