import axios from "axios";
import Cookies from "js-cookie";
import {
  MonthlyFinanceResponse,
  MonthlyFinancesResponse,
  MonthlyFinance,
} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/monthly-finance`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const monthlyFinanceApi = {
  getAll: async (): Promise<MonthlyFinancesResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  create: async (
    data: Omit<MonthlyFinance, "id">
  ): Promise<MonthlyFinanceResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (id: number, data: Partial<MonthlyFinance>): Promise<MonthlyFinanceResponse> => {
    console.log('Updating ID:', id, 'with data:', data);
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    console.log('Update response:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<MonthlyFinanceResponse> => {
    console.log('Deleting ID:', id);
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    console.log('Delete response:', response.data);
    return response.data;
  },


  getById: async (id: number): Promise<MonthlyFinanceResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
