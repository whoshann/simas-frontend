import axios from "axios";
import Cookies from "js-cookie";
import { Subject, SubjectResponse, SubjectsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/subjects`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const subjectsApi = {
    getAll: async (): Promise<SubjectsResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<Subject, "id" | "createdAt" | "updatedAt">): Promise<SubjectResponse> => {
        console.log('Data yang akan dikirim:', data);
        
        const response = await axios.post(API_URL, data, { 
            headers: getHeaders(),
        });
        return response.data;
    },

    update: async (id: number, data: Partial<Subject>): Promise<SubjectResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<SubjectResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};