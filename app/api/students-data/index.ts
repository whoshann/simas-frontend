import axios from "axios";
import Cookies from "js-cookie";
import { StudentData, StudentDataResponse, StudentsDataResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student-data`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const studentsdataApi = {
  getAll: async (): Promise<StudentsDataResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<StudentDataResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (data: Omit<StudentData, "id">): Promise<StudentDataResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (id: number, data: Partial<StudentData>): Promise<StudentDataResponse> => {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<StudentDataResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
