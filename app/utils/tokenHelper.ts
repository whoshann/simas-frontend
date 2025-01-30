import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface CustomJwtPayload {
  sub: number;
  role: string;
  // ... properti lain yang mungkin ada di token
}

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

export const getUserIdFromToken = (): string | null => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    return decodedToken.sub.toString();
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
