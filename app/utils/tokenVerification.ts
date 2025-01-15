import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface JwtPayload {
  role: string;
  exp: number;
  signature?: string;
}

export const verifyToken = () => {
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

    return decoded;
  } catch (error) {
    Cookies.remove("token");
    window.location.href = "/login";
    throw error;
  }
};
