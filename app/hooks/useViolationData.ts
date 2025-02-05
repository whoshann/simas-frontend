import { useState } from "react";
import { Violation } from "../api/violation/types";
import { violationApi } from "../api/violation";
import { error } from "console";

export const useViolation = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const response = await violationApi.getAll();
      setViolations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching Dispense");
      console.error("Error fetching Dispense:", err);
    } finally {
      setLoading(false);
    }
  };


  const createViolation = async (data: Omit<Violation, "id" | "createdAt" | "updatedAt" | "violationPoint" | "student">) => {
    try {
        await violationApi.create(data);
        await fetchViolations();
    } catch (err) {
        console.error("Error creating violation:", err);
        throw err;
    }
};


  const updateViolation = async (id: number, data: Partial<Violation>) => {
    try {
      await violationApi.update(id, data);
      await fetchViolations();
    } catch (err) {
      console.error("Error updating violation:", err);
      throw err;
    }
  };

  const deleteViolation = async (id: number) => {
    try {
      await violationApi.delete(id);
      await fetchViolations();
    } catch (err) {
      console.error("Error deleting repair:", err);
      throw err;
    }
  };
  
  return {
    violations,
    loading,
    error,
    fetchViolations,
    createViolation,
    updateViolation,
    deleteViolation
  };
};
