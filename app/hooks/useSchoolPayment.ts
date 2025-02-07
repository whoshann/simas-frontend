import { useState, useCallback } from "react";
import { PaymentSpp, PaymentSppResponse } from "../api/school-payment/types";
import { schoolPaymentApi } from "../api/school-payment";
import { getTokenData } from "../utils/tokenHelper";

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

  const fetchPaymentSppByStudentId = useCallback(async () => {
    try {
      setLoading(true);
      const tokenData = getTokenData();
      
      if (!tokenData?.id) {
        throw new Error('ID siswa tidak ditemukan');
      }

      const response = await schoolPaymentApi.getByStudentId(Number(tokenData.id));
      setPaymentSpp(response.data);

      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data pembayaran SPP");
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
    fetchPaymentSppByStudentId,
  };
};