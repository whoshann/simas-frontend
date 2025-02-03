import axios from "axios";
import Cookies from "js-cookie";
import { NewsInformation, NewsInformationResponse,  } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student-information`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const newsInformationApi = {
  getAll: async (): Promise<NewsInformationResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<NewsInformationResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<NewsInformation, "id" | "createdAt" | "updatedAt">
  ): Promise<NewsInformationResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<NewsInformation>
  ): Promise<NewsInformationResponse> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, data, {
        headers: getHeaders(),
      });
      // console.log('Update response:', response.data); // Log respons API
      return response.data;
    } catch (err) {
      // console.error('Error updating news information:', err); // Log error
      throw err; // Re-throw error jika perlu
    }
  },  

  delete: async (id: number): Promise<NewsInformationResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
