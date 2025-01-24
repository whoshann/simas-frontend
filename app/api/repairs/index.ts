import axios from "axios";
import Cookies from "js-cookie";
import { Repairs, RepairsResponse, RepairsListResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/maintenance-record`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const repairsApi = {
  getAll: async (): Promise<RepairsListResponse> => {
    const response = await axios.get(`${API_URL}?include=inventory,room`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<RepairsResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<Repairs, "id" | "createdAt" | "updatedAt">
  ): Promise<RepairsResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Repairs>
  ): Promise<RepairsResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<RepairsResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
