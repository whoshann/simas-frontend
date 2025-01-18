"use client";
import "@/app/styles/globals.css";
import React from "react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";

export default function FacilitiesBudgetProposalPage() {
  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
    roleMiddleware(["Facilities", "SuperAdmin"]);

    fetchDataAuth()
  }, []);

  const token = Cookies.get("token");
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);


  const fetchDataAuth = async () => {
    try {
      // Set default Authorization header dengan Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch data user dari endpoint API
      const response = await axios.get("http://localhost:3333/users");
      setUser(response.data); // Simpan data user ke dalam state
    } catch (err: any) {
      console.error("Error saat fetching data:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false); // Set loading selesai
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan RAB</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Pengajuan RAB</p>
      </header>

      {/* Breadcrumb Section */}
      <div className="px-9 mb-6">
        <nav className="flex text-sm font-medium text-gray-600">
          <a href="/" className="text-gray-400 hover:text-blue-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/sarpras-pengajuan" className="text-gray-800 font-semibold hover:text-blue-600">Pengajuan RAB</a>
        </nav>
      </div>

      {/* Alert Section */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-6 py-4 mx-9 flex items-start mb-6">
        <i className="bx bx-info-circle text-2xl mr-3"></i>
        <div>
          <p className="text-sm font-medium">
            Untuk mempermudah proses pengajuan RAB, silakan baca panduan lengkap terlebih dahulu.
          </p>
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 hover:underline font-medium focus:outline-none"
          >
            Lihat Panduan
          </button>
        </div>
      </div>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Pengajuan RAB</span>
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="namaRencana"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Rencana Anggaran Biaya
                </label>
                <input
                  type="text"
                  id="namaRencana"
                  name="namaRencana"
                  placeholder="Gelar Karya Pembelajaran"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="jumlahDana"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jumlah Dana Yang Diajukan
                </label>
                <input
                  type="text"
                  id="jumlahDana"
                  name="jumlahDana"
                  placeholder="600.000"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="documentRAB"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Pengajuan RAB
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="file"
                    id="documentRAB"
                    name="documentRAB"
                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="alasanPengajuan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alasan Pengajuan Rencana Anggaran Biaya
                </label>
                <textarea
                  id="alasanPengajuan"
                  name="alasanPengajuan"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-40 border border-[var(--main-color)] text-[var(--main-color)] font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 mb-3"
              >
                Gunakan AI
              </button>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
