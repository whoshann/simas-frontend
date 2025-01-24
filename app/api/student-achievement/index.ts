import { StudentAchievement, StudentAchievementResponse } from "./types";
import Cookies from "js-cookie";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/achievement`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const studentAchievementApi = {
  getAll: async (): Promise<StudentAchievementResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },
};
