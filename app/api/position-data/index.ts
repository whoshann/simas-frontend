import axios from "axios";
import Cookies from "js-cookie";
import { Position, PositionResponse, PositionsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/positions`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const positionsApi = {
    getAll: async (): Promise<PositionsResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<Position, "id" | "createdAt" | "updatedAt">): Promise<PositionResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<Position>): Promise<PositionResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<PositionResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};