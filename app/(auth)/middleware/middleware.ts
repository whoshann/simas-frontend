import { verifyToken } from "@/app/utils/tokenVerification";
import Cookies from "js-cookie";

export const roleMiddleware = async (allowedRoles: string[]) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/login";
      throw new Error("Token tidak ditemukan");
    }

    const decoded = await verifyToken();
    if (!allowedRoles.includes(decoded.role)) {
      window.location.href = "/unauthorized";
      throw new Error("Role tidak diizinkan");
    }

    return decoded;
  } catch (error) {
    Cookies.remove("token");
    window.location.href = "/login";
    throw error;
  }
};
