import { useState } from "react";
import { authApi } from "@/app/(auth)/api/auth";
import { JwtPayload } from "@/app/(auth)/api/auth/types";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { ROUTES } from "../(auth)/api/auth/routes";

export const useAuth = () => {
  const [error, setError] = useState("");

  const login = async (identifier: string, password: string) => {
    try {
      const result = await authApi.login({ username: identifier, password });
      const token = result.data.access_token;

      Cookies.set("token", token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      const decodedToken = jwtDecode<JwtPayload>(token);
      return handleRoleRedirect(decodedToken.role);
    } catch (err: any) {
      setError(err.message || "Gagal login. Silakan coba lagi.");
      throw err;
    }
  };

  const handleRoleRedirect = (role: string): string => {
    const roleRoutes: Record<string, string> = {
      SuperAdmin: ROUTES.DASHBOARD.SUPERADMIN,
      Teacher: ROUTES.DASHBOARD.TEACHER,
      Student: ROUTES.DASHBOARD.STUDENT,
      Facilities: ROUTES.DASHBOARD.FACILITIES,
      // ... tambahkan role lainnya
    };

    const route = roleRoutes[role];
    if (!route) {
      throw new Error("Role tidak dikenal. Silakan hubungi administrator.");
    }

    return route;
  };

  return {
    login,
    error,
  };
};
