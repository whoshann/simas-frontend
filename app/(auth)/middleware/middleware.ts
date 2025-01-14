import Cookies from "js-cookie";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

export const roleMiddleware = (allowedRoles: string[], redirectPath = "/login") => {
  const token = Cookies.get("token");
  if (!token) {
    window.location.href = redirectPath; // Redirect jika tidak ada token
    return;
  }

  try {
    // Decode JWT token untuk mendapatkan informasi role
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const userRole = decodedToken.role;

    // Periksa apakah role pengguna diizinkan mengakses halaman
    if (!allowedRoles.includes(userRole)) {
      window.location.href = redirectPath; // Arahkan ke halaman login atau halaman lain
      return;
    }
  } catch (error) {
    console.error("Token tidak valid atau telah kedaluwarsa.", error);
    window.location.href = redirectPath; // Arahkan ke halaman login
  }
};
