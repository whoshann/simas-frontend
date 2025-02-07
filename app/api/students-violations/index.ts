import axios from "axios";
import Cookies from "js-cookie";
import { StudentViolations, StudentViolationsResponse, StudentsViolationsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student-violations`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const studentsviolationsApi = {
    getAll: async (): Promise<StudentsViolationsResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<StudentViolations, "id" | "createdAt" | "updatedAt">): Promise<StudentViolationsResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<StudentViolations>): Promise<StudentViolationsResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<StudentViolationsResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};