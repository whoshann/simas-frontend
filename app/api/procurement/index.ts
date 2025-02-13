import Cookies from "js-cookie";
import axios from "axios";
import { Procurement, ProcurementResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/procurements`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const procurementsApi = {
  getAll: async (): Promise<ProcurementResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },
  getById: async (id: string): Promise<ProcurementResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  updateStatus: async (
    id: string,
    data: {
      procurementStatus: string;
      updateMessage: string;
    }
  ): Promise<ProcurementResponse> => {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      data,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  },
  getDocument: async (filename: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/document/${filename}`, {
      headers: getHeaders(),
      responseType: "blob",
    });
    return response.data;
  },
  create: async (formData: FormData): Promise<ProcurementResponse> => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
