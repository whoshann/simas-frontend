import { LoginCredentials, LoginResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

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
};
