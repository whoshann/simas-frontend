import axios from "axios";
import Cookies from "js-cookie";
import { Absence, AbsenceResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/absence`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "multipart/form-data",
});

export const absenceApi = {
  getAll: async (): Promise<AbsenceResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<AbsenceResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: Omit<Absence, "id" | "createdAt" | "updatedAt" | "student">
  ): Promise<AbsenceResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Absence>
  ): Promise<AbsenceResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<AbsenceResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  // Fungsi untuk mengambil absensi bulanan
  getMonthlyAbsences: async (
    studentId: number,
    year: number,
    month: number
  ): Promise<AbsenceResponse> => {
    const response = await axios.get(
      `${API_URL}/monthly/${studentId}?year=${year}&month=${month}`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  },

  // Fungsi untuk mengambil statistik absensi
  getStatistics: async (
    studentId: number,
    year?: number,
    month?: number
  ): Promise<AbsenceResponse> => {
    const url = `${API_URL}/statistics/${studentId}?year=${year ?? ""}&month=${
      month ?? ""
    }`;
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
