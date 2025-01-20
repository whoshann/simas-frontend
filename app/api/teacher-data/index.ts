import axios from "axios";
import Cookies from "js-cookie";
import { Teacher, TeacherResponse, TeachersResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/teachers`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
});

export const teachersApi = {
    getAll: async (): Promise<TeachersResponse> => {
        const response = await axios.get(API_URL, { 
            headers: getHeaders() 
        });
        return response.data;
    },

    create: async (formData: FormData): Promise<TeacherResponse> => {
        const response = await axios.post(API_URL, formData, { 
            headers: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: number, formData: FormData): Promise<TeacherResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, formData, {
            headers: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data',
            },
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