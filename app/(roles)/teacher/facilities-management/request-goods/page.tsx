"use client";

import React from "react";
import Image from "next/legacy/image";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function TeacherRequestGoodsPage() {

  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Teacher'
    roleMiddleware(["Teacher"]);
}, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan Barang</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Pengajuan Barang</p>
      </header>

      <main className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Image
                src="/images/icon-lending.png"
                alt="Ikon Informasi"
                className="mr-2 w-6 h-6"
                width={24}
                height={24}
              />
              <span className="ml-2">Informasi Detail Pengajuan</span>
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="namaBarang"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Barang
                </label>
                <select
                  id="namaBarang"
                  name="namaBarang"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700"
                >
                  <option>Papan Tulis</option>
                  <option>Proyektor</option>
                  <option>Meja</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="hargaSatuan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga Satuan
                  </label>
                  <input
                    type="text"
                    id="hargaSatuan"
                    name="hargaSatuan"
                    placeholder="Rp. 54.000"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalHarga"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Harga
                  </label>
                  <input
                    type="text"
                    id="totalHarga"
                    name="totalHarga"
                    placeholder="Rp. 108.000"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pemasok"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pemasok
                </label>
                <input
                  type="text"
                  id="pemasok"
                  name="pemasok"
                  placeholder="Sinar Jaya"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalPengajuan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Pengajuan Barang
                </label>
                <input
                  type="date"
                  id="tanggalPengajuan"
                  name="tanggalPengajuan"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="bg-[var(--main-color)] text-white rounded-lg p-6 flex flex-col justify-center items-center">
            <Image
              src="/images/pengajuan-barang.svg"
              alt="Ilustrasi Pengajuan"
              className="mb-4 w-1/2"
              width={500}
              height={300}
            />
            <div className="mb-4"></div> {/* Menambahkan margin-bottom untuk memberikan ruang */}
            <h2 className="text-lg font-bold text-center mb-2">
              Ajukan Pengajuan Barang Dengan Mudah!
            </h2>
            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih Cepat!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
