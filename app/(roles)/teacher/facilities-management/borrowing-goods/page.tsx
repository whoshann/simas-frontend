"use client";

import React from 'react';
import "@/app/styles/globals.css";
import Image from 'next/legacy/image';
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function TeacherBorrowingGoodsPage() {
  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Teacher'
    roleMiddleware(["Teacher"]);
}, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-bold-color)]">Peminjaman Barang</h1>
        <p className="text-sm text-[var(--text-thin-color)]">Halo, selamat datang di halaman Peminjaman Barang</p>
      </header>

      <main className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--main-color)] text-white rounded-lg p-6 flex flex-col justify-center items-center">
            <Image 
              src="/images/siswa-peminjamanberhasil-sarpras_1.svg" 
              alt="Ilustrasi Siswa" 
              className="mb-4 rounded w-1/2"
              width={500}
              height={300}
            />
            <h2 className="text-lg font-bold mb-2 text-center mt-4 text-white">Ajukan Peminjaman Barangmu Dengan Mudah!</h2>
      
            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih Cepat!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-[var(--text-bold-color)] mb-4 flex items-center">
              <Image src="/images/icon-lending.png" alt="Ikon Informasi" className="mr-2 w-6 h-6" width={24} height={24} />
              <span className="ml-2">Informasi Detail Peminjaman</span>
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan nama peminjam
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  placeholder="Revina Okta Safitri"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[var(--main-color)] focus:ring-[var(--main-color)] sm:text-sm px-4 py-2 text-[var(--text-regular-color)] bg-white"
                />
              </div>

              <div>
                <label htmlFor="barang" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Pilih Barang yang dipinjam
                </label>
                <select
                  id="barang"
                  name="barang"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-[var(--main-color)] focus:ring-[var(--main-color)] sm:text-sm px-4 py-2 text-[var(--text-regular-color)] pr-10"
                >
                  <option>Proyektor</option>
                  <option>Laptop</option>
                  <option>Speaker</option>
                </select>
              </div>

              <div>
                <label htmlFor="jumlah" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan Jumlah Barang
                </label>
                <input
                  type="number"
                  id="jumlah"
                  name="jumlah"
                  placeholder="1"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[var(--main-color)] focus:ring-[var(--main-color)] sm:text-sm px-4 py-2 text-[var(--text-regular-color)] bg-white"
                />
              </div>

              <div>
                <label htmlFor="jaminan" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Pilih jaminan
                </label>
                <select
                  id="jaminan"
                  name="jaminan"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-[var(--main-color)] focus:ring-[var(--main-color)] sm:text-sm px-4 py-2 text-[var(--text-regular-color)] pr-10"
                >
                  <option>KTP</option>
                  <option>Handphone</option>
                  <option>Kartu Pelajar</option>
                </select>
              </div>

              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan Tanggal Peminjaman
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[var(--main-color)] focus:ring-[var(--main-color)] sm:text-sm px-4 py-2 text-[var(--text-regular-color)] bg-white"
                />
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
