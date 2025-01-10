"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decoded, setDecoded] = useState(null); // Tambahkan state untuk decoded token

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
    return <div className="text-center mt-20">Loading...</div>;
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
    <main className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full bg-[var(--main-color)] h-40"></div>
      <div className="w-[24rem] sm:w-full max-w-4xl bg-white rounded-lg shadow -mt-16 py-12 px-6 flex flex-col sm:flex-row">
        <div className="sm:w-1/3 flex flex-col items-center justify-center border-0 sm:border-r sm:pr-6">
          {user?.role === "Teacher" ? (
            <Image
              src={user?.picture || "/images/Berita1.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
              width={256}
              height={256}
            />
          ) : (
            <Image
              src="/images/Berita1.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
              width={256}
              height={256}
            />
          )}
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
