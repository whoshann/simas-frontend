"use client";

import "@/app/styles/globals.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";


import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [decoded, setDecoded] = useState(null);

    const fetchUserData = async () => {
        try {
            const token = Cookies.get("token");

            if (!token) {
                throw new Error("Token is not available");
            }

            // Decode JWT payload dan simpan di state
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            setDecoded(decodedToken);

            const id = decodedToken.sub;
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Tentukan endpoint berdasarkan role
            const endpoint =
                decodedToken.role === "Teacher"
                    ? `http://localhost:3333/teachers/${id}`
                    : `http://localhost:3333/student/${id}`;

            const response = await axios.get(endpoint);
            setUser(response.data?.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(
                err.response?.data?.message || "Terjadi kesalahan saat memuat data."
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Hapus cookies secara manual
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");

        // Redirect ke halaman login
        window.location.href = "/login";
    };

    useEffect(() => {
        roleMiddleware(["Student", "SuperAdmin", "Teacher"]); // Perluas middleware
        fetchUserData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    }

    const ProfileField = ({ label, value }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
            </label>
            <p className="text-sm text-gray-600">{value || "N/A"}</p>
        </div>
    );

    return (
        <main className=" flex flex-col items-center">
            <div className="w-full bg-[var(--main-color)] h-40"></div>
            <div className="w-[24rem] sm:w-full max-w-4xl bg-white rounded-lg shadow -mt-16 py-12 px-6 flex flex-col sm:flex-row">
                <div className="sm:w-1/3 flex flex-col items-center justify-center border-0 sm:border-r sm:pr-6">
                    <div className="w-40 h-40 rounded-full shadow bg-gray-300 overflow-hidden ">
                        {user?.role === "Teacher" ? (
                            <img
                                src={user?.picture ? `http://localhost:3333/${user.picture}` : "/images/Berita1.jpg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="data:image/png;base64,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"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-700 mt-4">
                        {user.name || "Pengguna"}
                    </h2>
                </div>

                {/* Right Profile Form */}
                <div className="sm:w-2/3 sm:pl-6 mt-6 sm:mt-0">
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">
                        Profil Pengguna
                    </h3>
                    <div className="space-y-4">
                        {decoded?.role === "Teacher" ? (
                            // Tampilan untuk guru
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ProfileField label="Nama" value={user?.name} />
                                <ProfileField label="NIP" value={user?.nip} />
                                <ProfileField
                                    label="Mata Pelajaran"
                                    value={user?.subject?.name}
                                />
                                <ProfileField
                                    label="Jabatan"
                                    value={user?.position?.position}
                                />
                                <ProfileField label="Nomor Telepon" value={user?.phone} />
                                <ProfileField
                                    label="Tanggal Lahir"
                                    value={
                                        user?.birthDate
                                            ? new Date(user.birthDate).toLocaleDateString("id-ID")
                                            : "N/A"
                                    }
                                />
                                <ProfileField label="Alamat" value={user?.address} />
                                <ProfileField
                                    label="Pendidikan Terakhir"
                                    value={user?.lastEducation}
                                />
                            </div>
                        ) : (
                            // Tampilan untuk siswa
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ProfileField label="Nama Lengkap" value={user?.name} />
                                <ProfileField label="Kelas" value={user?.class?.name} />
                                <ProfileField label="Jurusan" value={user?.major?.name} />
                                <ProfileField label="NISN" value={user?.nisn} />
                                <ProfileField label="NIS" value={user?.nis} />
                                <ProfileField
                                    label="Tanggal Lahir"
                                    value={
                                        user?.birthDate
                                            ? new Date(user.birthDate).toLocaleDateString("id-ID")
                                            : "N/A"
                                    }
                                />
                                <ProfileField label="Nomor Telepon" value={user?.phone} />
                                <ProfileField label="Alamat" value={user?.address} />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={logout}
                                className="bg-[var(--main-color)] hover:bg-[#2359ab] text-white text-sm font-medium py-3 rounded shadow"
                            >
                                Logout / Keluar
                            </button>
                            <button className="bg-[var(--main-color)] hover:bg-[#2359ab] text-white text-sm font-medium py-3 rounded shadow">
                                Ubah Kata Sandi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserProfile;
