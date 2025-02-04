"use client";

import "@/app/styles/globals.css";
import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Image from "next/legacy/image";


export default function LoginPage() {

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const { login, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(false);
        try {
            const redirectUrl = await login(identifier, password);
            window.location.href = redirectUrl;
        } catch (err) {
            // Error sudah ditangani di useAuth
            console.error(err);
            setLoginError(true);
        }
    };

    const inputClassName = `w-full p-3 border ${loginError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } rounded-md focus:outline-none focus:ring-2 text-black bg-white`;

    return (
        <div
            className="flex flex-col md:flex-row h-screen bg-[#F2F2F2] items-center justify-center"
        >
            <div className="md:w-1/2 flex items-center justify-center">
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
                            className={inputClassName}
                            value={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                                setLoginError(false);
                            }}
                        />
                    </div>

                    <div className="relative flex items-center justify-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Kata Sandi"
                            className={inputClassName}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLoginError(false);
                            }}
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

                    {/* Pesan error */}
                    {loginError && (
                        <p className="text-red-500 text-sm mt-1">
                            NIS/NIP atau kata sandi yang Anda masukkan salah
                        </p>
                    )}

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