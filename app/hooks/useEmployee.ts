import { useState } from "react";
import { Employee } from "@/app/api/employee/types";
import { employeeApi } from "@/app/api/employee";

export const useEmployee = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAll();
      const processedData = response.data.map((news: Employee) => ({
        ...news,
        picture: news.photo ?? "", // Gunakan string kosong jika null
      }));

      setEmployee(processedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching Employee");
      console.error("Error fetching Employee:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt" | "TeacherRole">
  ) => {
    try {
      await employeeApi.create(data);
      await fetchEmployee();
    } catch (err) {
      console.error("Error creating news Information:", err);
      throw err;
    }
  };

  const updateEmployee = async (id: number, data: Partial<Employee>) => {
    try {
      await employeeApi.update(id, data);
      await fetchEmployee();
    } catch (err) {
      console.error("Error updating news Information:", err);
      throw err;
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await employeeApi.delete(id);
      await fetchEmployee();
    } catch (err) {
      console.error("Error deleting news Information:", err);
      throw err;
    }
  };

  return {
    employee,
    loading,
    error,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
