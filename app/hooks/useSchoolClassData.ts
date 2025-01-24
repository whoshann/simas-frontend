import { useState } from "react";
import { SchoolClass } from "@/app/api/school-class/types";
import { schoolClassesApi } from "@/app/api/school-class";

export const useSchoolClasses = () => {
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchoolClasses = async () => {
    try {
      setLoading(true);
      const response = await schoolClassesApi.getAll();
      setSchoolClasses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching school classes");
      console.error("Error fetching school classes:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    schoolClasses,
    loading,
    error,
    fetchSchoolClasses,
  };
};