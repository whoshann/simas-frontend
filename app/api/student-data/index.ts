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
        const response = await axios.get(`${API_URL}?include=classSchool,major`, { 
            headers: getHeaders() 
        });
        return response.data;
    },

    create: async (data: Omit<Student, "id" | "createdAt" | "updatedAt" | "classSchool" | "major">): Promise<StudentResponse> => {
        const payload = {
            ...data,
            classSchoolId: Number(data.classSchoolId),
            majorId: Number(data.majorId)
        };
        const response = await axios.post(API_URL, payload, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<Omit<Student, "classSchool" | "major">>): Promise<StudentResponse> => {
        const payload = {
            ...data,
            classSchoolId: data.classSchoolId ? Number(data.classSchoolId) : undefined,
            majorId: data.majorId ? Number(data.majorId) : undefined
        };
        const response = await axios.patch(`${API_URL}/${id}`, payload, {
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