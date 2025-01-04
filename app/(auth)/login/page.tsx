"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { loginUser } from "../api/api";
import Cookies from "js-cookie";
import Image from 'next/image';


export default function LoginPage() {

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await loginUser(identifier, password);
            console.log("Login berhasil:", result);

            // Simpan token ke dalam cookies
            Cookies.set("token", result.data.access_token, {
                expires: 1, // Cookie akan kedaluwarsa dalam 1 hari
                secure: process.env.NODE_ENV === "production", 
                sameSite: "strict", 
            });

            // Arahkan ke halaman dashboard
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Gagal login. Silakan coba lagi.");
        }
    };

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
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
                    width={30}  
                    height={100} 
                    layout="responsive"
                />
            </div>

            <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 w-full px-8 md:px-16 mt-4 md:mt-0">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
                    Selamat Datang Kembali!
                </h1>

                <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Masukkan NIS"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Kata Sandi"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Image
                                src={showPassword ? "/images/eye.png" : "/images/hidden.png"}
                                alt="Toggle Password Visibility"
                                className="h-5"
                                width={20}  
                                height={10} 
                                layout="responsive"
                            />
                        </span>
                    </div>

                    <div className="text-right">
                        <a href="/changepassword" className="text-sm text-gray-500 hover:underline">
                            Ubah Kata Sandi?
                        </a>
                    </div>

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
