import axios from "axios";
import { LoginCredentials, LoginResponse } from "./types";
import Cookies from "js-cookie";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(
        "Gagal login. Periksa kembali identitas dan kata sandi Anda."
      );
    }

    return response.json();
  },

  verifyToken: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify`,
        {},
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
