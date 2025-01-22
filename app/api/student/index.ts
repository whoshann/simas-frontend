import axios from "axios";
import { Student, StudentResponse, StudentsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student`;

export const studentsApi = {
  getAll: async (): Promise<StudentsResponse> => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  },

  create: async (
    data: Omit<Student, "id" | "createdAt" | "updatedAt" | "Class" | "Major">
  ): Promise<StudentResponse> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Omit<Student, "Class" | "Major">>
  ): Promise<StudentResponse> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
