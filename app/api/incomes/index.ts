import axios from "axios";
import Cookies from "js-cookie";
import {
  Income,
  IncomesRequest,
  UpdateIncomesRequest,
  IncomesResponse,
  IncomesResponses,
} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/income-details`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const incomeApi = {
  getAll: async (): Promise<IncomesResponses> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<IncomesResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (data: IncomesRequest): Promise<IncomesResponse> => {
    try {
      // Pastikan format data sesuai
      const formattedData = {
        monthlyFinanceId: data.monthlyFinanceId,
        source: data.source,
        description: data.description,
        amount: data.amount,
        incomeDate: data.incomeDate
      };

      const response = await axios.post(API_URL, formattedData, { 
        headers: getHeaders(),
        withCredentials: true // Tambahkan ini untuk mengirim cookies
      });
      return response.data;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  },

  update: async (
    id: number,
    data: UpdateIncomesRequest
  ): Promise<IncomesResponse> => {
    // Bersihkan data yang tidak diperlukan
    const {
      id: _id,
      createdAt,
      updatedAt,
      monthlyFinanceId,
      ...updateData
    } = data as any;

    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<IncomesResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
