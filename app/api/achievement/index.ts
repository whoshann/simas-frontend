import axios from "axios";
import Cookies from "js-cookie";
import { Achievements, AchievementsResponse} from "./types";

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/achievement`;

export const achievementsApi = {
    getAll: async (): Promise<AchievementsResponse> => {
        const response = await axios.get(`${API_URL}`, { headers: getHeaders() });
        console.log("Achievements data:", response.data); // Untuk debugging
        return response.data;
      },

    create: async (
        data: Omit<Achievements, "id" | "createdAt" | "updatedAt" | "Class" | "Student">
      ): Promise<AchievementsResponse> => {
        const response = await axios.post(API_URL, data, { headers: getHeaders() });
        return response.data;
      },
    
      update: async (
        id: number,
        data: Partial<Omit<Achievements, "Class" | "Student">>
      ): Promise<AchievementsResponse> => {
        const response = await axios.put(`${API_URL}/${id}`, data, {
          headers: getHeaders(),
        });
        return response.data;
      },
    
      delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      },
};