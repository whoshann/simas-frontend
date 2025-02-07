import axios from "axios";
import Cookies from "js-cookie";
import { Major, MajorsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/majors`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const majorsApi = {
    getAll: async (): Promise<MajorsResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<Major, "id" | "createdAt" | "updatedAt">): Promise<MajorsResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<Major>): Promise<MajorsResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<MajorsResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};