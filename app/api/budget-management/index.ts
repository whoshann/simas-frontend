import axios from "axios";
import Cookies from "js-cookie";
import { BudgetManagementResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/budget-estimate-plan`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const budgetManagementApi = {
  getAll: async (): Promise<BudgetManagementResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<BudgetManagementResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  getDocument: async (filename: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/document/${filename}`, {
      headers: getHeaders(),
      responseType: "blob",
    });
    return response.data;
  },

  updateStatus: async (
    id: number, 
    data: { 
      status: string; 
      updateMessage: string; 
    }
  ): Promise<BudgetManagementResponse> => {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      data,
      {
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

};