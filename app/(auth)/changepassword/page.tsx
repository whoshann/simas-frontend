"use client";

import { useState } from 'react';

export default function ChangePasswordPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="flex flex-col md:flex-row h-screen bg-white items-center justify-center"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >


            <div className="md:w-1/2 bg-white flex items-center justify-center">
                <img
                    src="/images/IlustrasiChangePassword.jpg"
                    alt="Illustration"
                    className="w-3/4 md:w-3/4 mx-auto mb-4 md:mb-0"
                />
            </div>

            <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 w-full px-8 md:px-16 mt-4 md:mt-0">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center md:text-left">
                    Ubah Kata Sandi
                </h1>
                <h2 className="text-lg font-medium text-gray-600 mb-6 text-center md:text-left">
                    Silakan masukkan kata sandi lama dan baru
                </h2>

                <form className="w-full max-w-sm space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Masukkan Kata Sandi Lama"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan Kata Sandi Baru"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={showPassword ? "images/eye.png" : "images/hidden.png"}
                                alt="Toggle Password Visibility"
                                className="h-5"
                            />
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Konfirmasi Kata Sandi Baru"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={showPassword ? "images/eye.png" : "images/hidden.png"}
                                alt="Toggle Password Visibility"
                                className="h-5"
                            />
                        </span>
                    </div>

                    <button
                        type="submit"
                        style={{ backgroundColor: '#1F509A' }}
                        className="w-full text-white py-3 rounded-md hover:opacity-90 transition"
                    >
                        Simpan
                    </button>
                </form>


            </div>
        </div>
    );
}