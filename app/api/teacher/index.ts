import axios from "axios";
import Cookies from "js-cookie";
import { Teachers, TeachersResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/teachers`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const teachersApi = {
  getAll: async (): Promise<TeachersResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<Teachers, "id" | "createdAt" | "updatedAt" | "subject" | "position">
  ): Promise<TeachersResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Teachers>
  ): Promise<TeachersResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<TeachersResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

};
