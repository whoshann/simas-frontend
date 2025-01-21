import axios from "axios";
import Cookies from "js-cookie";
import { Student, StudentResponse, StudentsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const studentsApi = {
    getAll: async (): Promise<StudentsResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<StudentResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<Student>): Promise<StudentResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<StudentResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};