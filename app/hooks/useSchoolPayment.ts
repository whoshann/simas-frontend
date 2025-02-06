import { useState, useCallback } from "react";
import { PaymentSpp } from "../api/school-payment/types";
import { schoolPaymentApi } from "../api/school-payment";

export const useSchoolPayment = () => {
  const [paymentSpp, setPaymentSpp] = useState<PaymentSpp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentSpp = useCallback(async () => {
    try {
      setLoading(true);
      const response = await schoolPaymentApi.getAll();
      setPaymentSpp(response.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data pembayaran SPP");
      console.error("Error fetching payment spp:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    paymentSpp,
    loading,
    error,
    fetchPaymentSpp,
  };
};