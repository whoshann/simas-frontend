"use client";

import "@/app/styles/globals.css";
import { useEffect, useRef } from 'react';
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';

export default function FacilitiesDashboard() {
  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
    roleMiddleware(["Facilities"]);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Beranda</h1>
        <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 pb-8">
    {/* Section: Summary Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
                <i className="bx bx-package text-2xl text-blue-500"></i>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-800">Barang Masuk</h4>
                <p className="text-lg font-bold text-gray-600">100</p>
            </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
                <i className="bx bx-export text-2xl text-yellow-500"></i>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-800">Barang Keluar</h4>
                <p className="text-lg font-bold text-gray-600">80</p>
            </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="p-3 bg-teal-100 rounded-full">
                <i className="bx bx-archive text-2xl text-teal-500"></i>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-800">Stok Barang</h4>
                <p className="text-lg font-bold text-gray-600">200</p>
            </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
                <i className="bx bx-building text-2xl text-red-500"></i>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-800">Total Ruang</h4>
                <p className="text-lg font-bold text-gray-600">50</p>
            </div>
        </div>
    </div>

    {/* Section: Repair Types */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repair Table */}
        <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-2">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Jenis Perbaikan</h4>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-separate border-spacing-2">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="px-4 py-2">Jenis Perbaikan</th>
                            <th className="px-4 py-2">Tanggal</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan Ruang Kelas</td>
                            <td className="px-4 py-4">15/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-500 text-sm font-medium">
                                    Sedang Berlangsung
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan CCTV</td>
                            <td className="px-4 py-4">15/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-500 text-sm font-medium">
                                    Pending
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan Toilet</td>
                            <td className="px-4 py-4">15/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-500 text-sm font-medium">
                                    Selesai
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan AC</td>
                            <td className="px-4 py-4">9/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-500 text-sm font-medium">
                                    Selesai
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan Pintu</td>
                            <td className="px-4 py-4">2/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-500 text-sm font-medium">
                                    Selesai
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan Ventilasi</td>
                            <td className="px-4 py-4">1/12/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-500 text-sm font-medium">
                                    Selesai
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="px-4 py-4">Perbaikan Gazebo</td>
                            <td className="px-4 py-4">28/11/24</td>
                            <td className="px-4 py-4">
                                <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-500 text-sm font-medium">
                                    Selesai
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* Space for Barang Loans and Requests */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Barang Loans */}
            <div className="bg-white shadow-md rounded-lg p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Peminjaman Barang</h4>
                    <button className="text-sm font-semibold text-blue-500 hover:underline">Lihat Detail</button>
                </div>
                <ul className="space-y-4">
                    <li className="flex justify-between text-gray-600">
                        <span>Proyektor</span>
                        <span className="text-sm">19/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Kursi</span>
                        <span className="text-sm">18/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Meja</span>
                        <span className="text-sm">18/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Kabel Olor</span>
                        <span className="text-sm">15/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Kabel HDMI</span>
                        <span className="text-sm">15/12/24</span>
                    </li>
                </ul>
            </div>

            {/* Barang Request */}
            <div className="bg-white shadow-md rounded-lg p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Pengajuan Barang</h4>
                    <button className="text-sm font-semibold text-blue-500 hover:underline">Lihat Detail</button>
                </div>
                <ul className="space-y-4">
                    <li className="flex justify-between text-gray-600">
                        <span>Proyektor</span>
                        <span className="text-sm">19/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Papan Tulis</span>
                        <span className="text-sm">18/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>AC</span>
                        <span className="text-sm">18/12/24</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                        <span>Kipas Angin</span>
                        <span className="text-sm">15/12/24</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</main>



    </div>
  );
}