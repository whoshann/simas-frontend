import Cookies from "js-cookie";
import { Violation, ViolationResponse, ViolationResponseByStudentId } from "./types";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/violations`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const violationApi = {
  getAll: async (): Promise<ViolationResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  create: async (
    data: Omit<Violation, "id" | "createdAt" | "updatedAt" | "violationPoint" | "student">
  ): Promise<ViolationResponse> => {
    const response = await axios.post(API_URL, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Violation>
  ): Promise<ViolationResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<ViolationResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getByStudentId: async (studentId: number): Promise<ViolationResponseByStudentId> => {
    const response = await axios.get(`${API_URL}/student/${studentId}`, {
      headers: getHeaders(),
    });
    return response.data;
  }
};
