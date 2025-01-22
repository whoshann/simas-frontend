import { useState, useCallback } from "react";
import { Absence } from "../api/absence/types";
import { absenceApi } from "../api/absence";

export const useAbsence = () => {
  const [absence, setAbsence] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbsence = useCallback(async () => {
    try {
      setLoading(true);
      const response = await absenceApi.getAll();
      setAbsence(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch absence");
      console.error("Error fetching absence:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { absence, loading, error, fetchAbsence };
};
