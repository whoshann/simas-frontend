import axios from "axios";
import Cookies from "js-cookie";
import { StudentClaimInsurance, StudentClaimInsuranceResponse, StudentsClaimInsuranceResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student`;

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

export const studentsclaiminsuranceApi = {
    getAll: async (): Promise<StudentsClaimInsuranceResponse> => {
        const response = await axios.get(API_URL, { headers: getHeaders() });
        return response.data;
    },

    create: async (data: Omit<StudentClaimInsurance, "id" | "createdAt" | "updatedAt">): Promise<StudentClaimInsuranceResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
    },

    update: async (id: number, data: Partial<StudentClaimInsurance>): Promise<StudentClaimInsuranceResponse> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data;
    },

    delete: async (id: number): Promise<StudentClaimInsuranceResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};