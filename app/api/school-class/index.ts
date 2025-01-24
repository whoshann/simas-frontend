import axios from "axios";
import Cookies from "js-cookie";
import { SchoolClass, SchoolClassResponse, UpdateSchoolClassDto } from "./types";

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

    update: async (id: number, data: UpdateSchoolClassDto): Promise<SchoolClass> => {
        try {
            // Pastikan data sesuai dengan schema
            const updateData = {
                name: data.name,
                code: data.code,
                grade: data.grade,
                homeroomTeacherId: Number(data.homeroomTeacherId),
                majorId: Number(data.majorId)
            };

            const response = await axios.patch(`${API_URL}/${id}`, updateData, {
                headers: getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<SchoolClassResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};