import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { authApi } from "../api/auth";

interface JwtPayload {
  role: string;
  exp: number;
  signature?: string;
}

export const verifyToken = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("No token found");

    const decoded = jwtDecode<JwtPayload>(token);

    // Cek expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      Cookies.remove("token");
      throw new Error("Token expired");
    }

    // Verifikasi token dengan backend
    const verification = await authApi.verifyToken();
    if (!verification.success) {
      throw new Error("Token invalid");
    }

    return decoded;
  } catch (error) {
    Cookies.remove("token");
    window.location.href = "/login";
    throw error;
  }
};
