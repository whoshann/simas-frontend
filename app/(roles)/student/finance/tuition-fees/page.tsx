"use client";

import React from "react";
import "@/app/styles/globals.css";
import Image from 'next/legacy/image';
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function StudentTuitionFeesPage() {
  const [payment, setPayment] = useState<string>("");

  const formatToRupiah = (value: string): string => {
    if (!value) return "";
    return "Rp " + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPayment(formatToRupiah(e.target.value));
  };

  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
    roleMiddleware(["Student"]);

  }, []);
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-bold-color)]">Pembayaran SPP</h1>
        <p className="text-sm text-[var(--text-thin-color)]">
          Halo James, selamat datang kembali
        </p>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-6">
        <div className="max-w-full mx-auto">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6 w-full mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
              <Image
                src="/images/icon-lending.png"
                alt="Ikon"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="ml-2 text-lg">Form Pembayaran SPP</span>
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="nis" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan NIS
                </label>
                <input
                  type="text"
                  id="nis"
                  placeholder="0092335191"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label htmlFor="kelas" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan Kelas
                </label>
                <select
                  id="kelas"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 pr-10"
                >
                  <option>XI RPL A</option>
                  <option>XI RPL B</option>
                  <option>XI RPL C</option>
                </select>
              </div>

              <div>
                <label htmlFor="jumlah" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan Jumlah Pembayaran
                </label>
                <input
                  type="text"
                  id="jumlah"
                  placeholder="Rp 600.000"
                  value={payment}
                  onChange={handlePaymentChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Semester
                </label>
                <select
                  id="semester"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 pr-10"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>

              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-[var(--text-regular-color)]">
                  Masukkan Tanggal Pembayaran
                </label>
                <input
                  type="date"
                  id="tanggal"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
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
        </div>
      </main>
    </div>
  );
}