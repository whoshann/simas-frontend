import axios from "axios";
import Cookies from "js-cookie";
import { MaintenanceRecord, MaintenanceRecordResponse, MaintenanceRecordsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/room`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const MaintenanceRecordsApi = {
  getAll: async (): Promise<MaintenanceRecordsResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<MaintenanceRecordResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (data: Omit<MaintenanceRecord, "id">): Promise<MaintenanceRecordResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (id: number, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecordResponse> => {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<MaintenanceRecordResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
