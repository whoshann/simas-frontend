import axios from "axios";
import Cookies from "js-cookie";
import { Teacher, TeachersResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/teachers`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
});

export const teachersApi = {
  getAll: async (): Promise<TeachersResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
