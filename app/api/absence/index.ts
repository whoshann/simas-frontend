import axios from "axios";
import Cookies from "js-cookie";
import { AbsenceResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/absence`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const absenceApi = {
  getAll: async (): Promise<AbsenceResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<AbsenceResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
