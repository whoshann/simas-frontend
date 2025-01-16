"use client";
import "@/app/styles/globals.css";
import React from "react";
import Image from "next/legacy/image";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function FacilitiesBudgetProposalPage() {

  useEffect(() => {
    roleMiddleware(["Student"]);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Prestasi</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Prestasi</p>
      </header>

      {/* Breadcrumb Section
      <div className="px-9 mb-6">
        <nav className="flex text-sm font-medium text-gray-600">
          <a href="/" className="text-gray-400 hover:text-blue-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/sarpras-pengajuan" className="text-gray-800 font-semibold hover:text-blue-600">Prestasi</a>
        </nav>
      </div> */}

      

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Prestasi</span>
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="namaPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Prestasi
                </label>
                <input
                  type="text"
                  id="namaPrestasi"
                  name="namaPrestasi"
                  placeholder="Contoh: Juara 1 Lomba Debat"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="kategoriPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kategori Prestasi
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
                  Nama Kompetisi
                </label>
                <input
                  type="text"
                  id="namaKompetisi"
                  name="namaKompetisi"
                  placeholder="Contoh: Lomba Debat Nasional 2025"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalPrestasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Prestasi
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
                  Bukti Foto
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
