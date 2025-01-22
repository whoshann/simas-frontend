import { useState } from "react";
import {
  SchoolClass,
  UpdateSchoolClassDto,
} from "@/app/api/school-class/types";
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
    } finally {
      setLoading(false);
    }
  };

  const createSchoolClass = async (
    data: Omit<SchoolClass, "id" | "major" | "homeroomTeacher">
  ) => {
    try {
      const response = await schoolClassesApi.create(data);
      await fetchSchoolClasses();
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const updateSchoolClass = async (id: number, data: UpdateSchoolClassDto) => {
    try {
      const response = await schoolClassesApi.update(id, data);
      await fetchSchoolClasses(); // Refresh data setelah update
      return response;
    } catch (error) {
      console.error("Error updating school class:", error);
      throw error;
    }
  };

  const deleteSchoolClass = async (id: number) => {
    try {
      await schoolClassesApi.delete(id);
      await fetchSchoolClasses();
    } catch (err: any) {
      throw err;
    }
  };

  return {
    schoolClasses,
    loading,
    error,
    fetchSchoolClasses,
    createSchoolClass,
    updateSchoolClass,
    deleteSchoolClass,
  };
};
