import Cookies from "js-cookie";
import { Dispense, DispenseResponse } from "./types";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/dispense`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const dispenseApi = {
  getAll: async (): Promise<DispenseResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  create: async (
    data: Omit<Dispense, "id" | "createdAt" | "updatedAt" | "dispenseStatus" | "student">
  ): Promise<DispenseResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (id: number, data: Partial<Dispense>): Promise<DispenseResponse> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating dispense status:", error);
      throw error;
    }
  },

  delete: async (id: number): Promise<DispenseResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
