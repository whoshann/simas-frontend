import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface TokenPayload {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const getTokenData = () => {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const decoded = jwtDecode<TokenPayload>(token);
    return {
      id: decoded.sub,
      role: decoded.role,
      username: decoded.username,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
