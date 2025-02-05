import axios from "axios";
import Cookies from "js-cookie";
import { BudgetManagement, BudgetManagementResponse,  } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student-information`;

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

};