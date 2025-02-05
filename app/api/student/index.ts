import axios from "axios";
import Cookies from "js-cookie";
import { Student, StudentResponse, StudentsResponse } from "./types";

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student`;

export const studentsApi = {
  getAll: async (): Promise<StudentsResponse> => {
    const response = await axios.get(`${API_URL}`, { headers: getHeaders() });
    console.log("Students data:", response.data); // Untuk debugging
    return response.data;
  },

  create: async (
    data: Omit<Student, "id" | "createdAt" | "updatedAt" | "Class" | "Major" | "track" | "admissionYear" | "religion">
  ): Promise<StudentResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Omit<Student, "Class" | "Major">>
  ): Promise<StudentResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
  },
};
