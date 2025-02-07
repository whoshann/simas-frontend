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

  const createSchoolClass = async (
    data: Omit<SchoolClass, "id" | "createdAt" | "updatedAt" | "major" | "homeroomTeacher">
  ) => {
    try {
      await schoolClassesApi.create(data);
      await fetchSchoolClasses();
    } catch (err) {
      console.error("Error creating school class:", err);
      throw err;
    }
  };

  const updateSchoolClass = async (id: number, data: Partial<SchoolClass>) => {
    try {
      await schoolClassesApi.update(id, data);
      await fetchSchoolClasses();
    } catch (err) {
      console.error("Error updating school class:", err);
      throw err;
    }
  };

  const deleteSchoolClass = async (id: number) => {
    try {
      await schoolClassesApi.delete(id);
      await fetchSchoolClasses();
    } catch (err) {
      console.error("Error deleting school class:", err);
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
    deleteSchoolClass
  };
};