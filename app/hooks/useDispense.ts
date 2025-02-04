import { dispenseApi } from './../api/dispense/index';
import { Dispense } from './../api/dispense/types';
import { useState } from "react";
import { error } from "console";
import { DispenseStatus } from "@/app/utils/enums";

export const useDispense = () => {
  const [dispenses, setDispenses] = useState<Dispense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchDispenses = async () => {
    try {
      setLoading(true);
      const response = await dispenseApi.getAll();
      setDispenses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching Dispense");
      console.error("Error fetching Dispense:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveDispense = async (id: number) => {
    try {
      setLoading(true);
      await dispenseApi.update(id, { status: DispenseStatus.Approved });
      await fetchDispenses(); // Refresh data setelah update
    } catch (err) {
      console.error("Error approving dispense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectDispense = async (id: number) => {
    try {
      setLoading(true);
      await dispenseApi.update(id, { status: DispenseStatus.Rejected });
      await fetchDispenses(); // Refresh data setelah update
    } catch (err) {
      console.error("Error rejecting dispense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    dispenses,
    loading,
    error,
    fetchDispenses,
    approveDispense,
    rejectDispense
  };
};
