import axios from "axios";
import Cookies from "js-cookie";
import { Teacher, TeacherResponse, TeachersResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/teachers`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const teachersApi = {
    getAll: async (): Promise<TeachersResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<Teacher, "id">): Promise<TeacherResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<Teacher>): Promise<TeacherResponse> => {
        const { id: _, ...updateData } = data;
        const response = await axios.patch(`${API_URL}/${id}`, updateData, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<TeacherResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};