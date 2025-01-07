"use client";

import React from "react";
import "@/app/styles/globals.css";
import Image from 'next/image';

export default function PaymentStatusPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pembayaran SPP</h1>
        <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
      </header>
      <main className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-start justify-between pb-4">
            <h2 className="text-lg font-medium text-gray-700">Tabel Status Pembayaran</h2>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <label htmlFor="entries" className="text-sm text-gray-600">Tampilkan</label>
              <select
                id="entries"
                className="block rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1"
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 w-full"
                />
                <Image src="/images/icon-search.png" alt="Search Icon" className="absolute left-3 top-2.5" width={16} height={16} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-gray-600">No</th>
                  <th className="px-4 py-2 text-gray-600">NIS</th>
                  <th className="px-4 py-2 text-gray-600">Kelas</th>
                  <th className="px-4 py-2 text-gray-600">Jumlah</th>
                  <th className="px-4 py-2 text-gray-600">Smt</th>
                  <th className="px-4 py-2 text-gray-600">Status</th>
                  <th className="px-4 py-2 text-gray-600">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { no: 1, nis: "009919828231", kelas: "XI RPL C", jumlah: "600.000", smt: 5, status: "Gagal", tanggal: "21/01/2024" },
                  { no: 2, nis: "009919828231", kelas: "XI RPL C", jumlah: "600.000", smt: 4, status: "Lunas", tanggal: "21/01/2024" },
                  { no: 3, nis: "009919828231", kelas: "XI RPL C", jumlah: "600.000", smt: 3, status: "Lunas", tanggal: "21/01/2024" },
                  { no: 4, nis: "009919828231", kelas: "XI RPL C", jumlah: "600.000", smt: 2, status: "Lunas", tanggal: "21/01/2024" },
                  { no: 5, nis: "009919828231", kelas: "XI RPL C", jumlah: "600.000", smt: 1, status: "Lunas", tanggal: "21/01/2024" },
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{row.no}</td>
                    <td className="px-4 py-2">{row.nis}</td>
                    <td className="px-4 py-2">{row.kelas}</td>
                    <td className="px-4 py-2">{row.jumlah}</td>
                    <td className="px-4 py-2">{row.smt}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-6 py-1 rounded-full text-sm font-medium ${
                          row.status === "Lunas"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">Menampilkan 1 hingga 5 dari 30 entri</p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">&lt;</button>
              <button className="px-3 py-1 rounded-md" style={{ backgroundColor: '#1f509a', color: 'white' }}>1</button>
              <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">2</button>
              <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">&gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
