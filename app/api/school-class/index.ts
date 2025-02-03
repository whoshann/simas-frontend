import axios from "axios";
import Cookies from "js-cookie";
import { SchoolClass, SchoolClassResponse} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/school-class`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const schoolClassesApi = {
    getAll: async (): Promise<SchoolClassResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<SchoolClass, "id" | "createdAt" | "updatedAt" | "major" | "homeroomTeacher">): Promise<SchoolClassResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<SchoolClass>): Promise<SchoolClassResponse> => {
        // Pastikan data yang dikirim sesuai dengan yang diharapkan backend
        const dataToSend = {
            name: data.name,
            code: data.code,
            grade: data.grade,
            majorId: data.majorId,
            homeroomTeacherId: data.homeroomTeacherId
        };
        
        const response = await axios.put(`${API_URL}/${id}`, dataToSend, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<SchoolClassResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};