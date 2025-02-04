import Cookies from "js-cookie";
import { ViolationResponse } from "./types";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/violations`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const violationApi = {
  post: async (): Promise<ViolationResponse> => {
    const response = await axios.post(API_URL, { headers: getHeaders() });
    return response.data;
  },

  patch: async (id: number): Promise<ViolationResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getAll: async (): Promise<ViolationResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  delete: async (id: number): Promise<ViolationResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
