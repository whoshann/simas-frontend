import Cookies from "js-cookie";
import { ViolationPointResponse } from "./types";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/violation-points`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const violationPointApi = {
  post: async (): Promise<ViolationPointResponse> => {
    const response = await axios.post(API_URL, { headers: getHeaders() });
    return response.data;
  },

  patch: async (id: number): Promise<ViolationPointResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getAll: async (): Promise<ViolationPointResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<ViolationPointResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getHeaders() });
    return response.data;
  },

  delete: async (id: number): Promise<ViolationPointResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
