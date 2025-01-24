"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect,useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";


export default function StudentAchievementPage() {

  useEffect(() => {
    const initializePage = async () => {
        try {
            await roleMiddleware(["Student","SuperAdmin"]);
            setIsAuthorized(true);
        } catch (error) {
            console.error("Auth error:", error);
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    };

    initializePage();
}, []);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Prestasi</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Prestasi</p>
      </header>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">  
            <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Prestasi</span>
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="namaPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masukkan Nama Prestasi
                </label>
                <input
                  type="text"
                  id="namaPrestasi"
                  name="namaPrestasi"
                  placeholder="Juara 1 Lomba Debat"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="kategoriPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pilih Kategori Prestasi
                </label>
                <select
                  id="kategoriPrestasi"
                  name="kategoriPrestasi"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="akademik">Akademik</option>
                  <option value="non-akademik">Non-Akademik</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="namaKompetisi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masukkan Nama Kompetisi
                </label>
                <input
                  type="text"
                  id="namaKompetisi"
                  name="namaKompetisi"
                  placeholder="Lomba Debat Nasional 2025"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masukkan Tanggal Prestasi
                </label>
                <input
                  type="date"
                  id="tanggalPrestasi"
                  name="tanggalPrestasi"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="buktiFoto"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Bukti Foto
                </label>
                <input
                  type="file"
                  id="buktiFoto"
                  name="buktiFoto"
                  className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                />
              </div>

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
