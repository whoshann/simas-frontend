import axios from "axios";
import Cookies from "js-cookie";
import { StudentAchievement, StudentAchievementResponse, StudentAchievementsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/facility`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const studentachievementsApi = {
  getAll: async (): Promise<StudentAchievementsResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<StudentAchievementResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (data: Omit<StudentAchievement, "id">): Promise<StudentAchievementResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (id: number, data: Partial<StudentAchievement>): Promise<StudentAchievementResponse> => {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<StudentAchievementResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
