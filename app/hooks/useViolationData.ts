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
    fetchViolations,
  };
};
