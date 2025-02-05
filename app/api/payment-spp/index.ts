import axios from "axios";
import Cookies from "js-cookie";
import { PaymentSpp, PaymentSppResponse,  } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/spp`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const paymentSppApi = {
  getAll: async (): Promise<PaymentSppResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<PaymentSppResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<PaymentSpp, "id" | "createdAt" | "updatedAt">
  ): Promise<PaymentSppResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<PaymentSpp>
  ): Promise<PaymentSppResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<PaymentSppResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};