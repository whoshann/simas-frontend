import axios from "axios";
import Cookies from "js-cookie";
import { Employee, EmployeeResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/employees`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const employeeApi = {
  getAll: async (): Promise<EmployeeResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt" >
  ): Promise<EmployeeResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Employee>
  ): Promise<EmployeeResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<EmployeeResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

};
