import { useState } from "react";
import { error } from "console";
import { violationPointApi } from "../api/violation-point";
import { ViolationPoint } from "../api/violation-point/types";

export const useViolationPoint = () => {
  const [violations, setViolations] = useState<ViolationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchViolationPoints = async () => {
    try {
      setLoading(true);
      const response = await violationPointApi.getAll();
      setViolations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching violations");
      console.error("Error fetching violations:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    violations,
    loading,
    error,
    fetchViolationPoints,
  };
};
