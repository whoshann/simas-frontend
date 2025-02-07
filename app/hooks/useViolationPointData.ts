import { useState } from "react";
import { ViolationPoint } from "../api/violation-point/types";
import { violationPointApi } from "../api/violation-point";

export const useViolationPoint = () => {
  const [violationPoints, setViolationPoints] = useState<ViolationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViolationPoints = async () => {
    try {
      setLoading(true);
      const response = await violationPointApi.getAll();
      setViolationPoints(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching violation points");
    } finally {
      setLoading(false);
    }
  };

  return { violationPoints, loading, error, fetchViolationPoints };
};