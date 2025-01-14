"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { loginUser } from "../api/api";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { jwtDecode } from "jwt-decode";


export default function LoginPage() {

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    interface CustomJwtPayload {
        role: string;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await loginUser(identifier, password);
            const token = result.data.access_token;
            // Simpan token ke dalam cookies
            Cookies.set("token", result.data.access_token, {
                expires: 1, // Cookie akan kedaluwarsa dalam 1 hari
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            const userRole = decodedToken.role;

            // Redirect berdasarkan role
            switch (userRole) {
                case "SuperAdmin":
                    window.location.href = "/superadmin";
                    break;
                case "Teacher":
                    window.location.href = "/teacher";
                    break;
                case "Student":
                    window.location.href = "/student";
                    break;
                case "StudentAffairs":
                    window.location.href = "/student-affairs";
                    break;
                case "PublicRelations":
                    window.location.href = "/dashboard/public-relations";
                    break;
                case "WorkshopHead":
                    window.location.href = "/dashboard/workshop-head";
                    break;
                case "Insdustry":
                    window.location.href = "/dashboard/industry";
                    break;
                case "Finance":
                    window.location.href = "/dashboard/finance";
                    break;
                case "Administration":
                    window.location.href = "/dashboard/administration";
                    break;
                case "Facilities":
                    window.location.href = "/facilities";
                    break;
                case "Curriculum":
                    window.location.href = "/dashboard/curriculum";
                    break;
                default:
                    console.error("Role tidak dikenal:", userRole);
                    setError("Role tidak dikenal. Silakan hubungi administrator.");
                    break;
            }
        } catch (err: any) {
            setError(err.message || "Gagal login. Silakan coba lagi.");
        }
    };

    return (
        <div
            className="flex flex-col md:flex-row h-screen items-center justify-center"
        >
            <div className="md:w-1/2 bg-white flex items-center justify-center">
                <Image
                    src="/images/IlustrasiLogin.svg"
                    alt="Illustration"
                    className="w-3/4 md:w-3/4 mx-auto mb-4 md:mb-0"
                    layout="intrinsic"
                    width={700}
                    height={400}
                    sizes="100vw"

                />
            </div>
            <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 w-full px-8 md:px-16 mt-4 md:mt-0">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
                    Selamat Datang Kembali!
                </h1>
                <p className="text-xs font-medium text-gray-800 mb-6 text-center md:text-left">
                    Masukkan NIS sebagai siswa dan NIP sebagai guru!
                </p>

                <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Masukkan NIS / NIP"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className="relative flex items-center justify-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Kata Sandi"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute right-3 top-3.5 cursor-pointer text-[var(--text-semi-bold-color)]"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <i className='bx bxs-show h-7' /> 
                            ) : (
                                <i className='bx bxs-hide h-7' /> 
                            )}
                        </span>
                    </div>

                    {/* <div className="text-right">
                        <a href="/changepassword" className="text-sm text-gray-500 hover:underline">
                            Ubah Kata Sandi?
                        </a>
                    </div> */}

                    <button
                        type="submit"
                        style={{ backgroundColor: '#1F509A' }}
                        className="w-full text-white py-3 rounded-md hover:opacity-90 transition"
                    >
                        Masuk
                    </button>
                </form>
            </div>
    </div>
);
}
