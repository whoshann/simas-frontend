"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import Image from 'next/image';

export default function PaymentStatusPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const data = [
    { no: 1, nama: "Gelar Karya Pembelajaran", jumlah: "1.000.000", doc: "Proyek Kegiatan Sekolah.pdf", status: "Belum Disetujui", tanggal: "21/01/2024" },
    { no: 2, nama: "Perbaikan Ruang Kelas Rusak", jumlah: "1.000.000", doc: "Perawatan Fasilitas.pdf", status: "Di Setujui", tanggal: "21/01/2024" },
    { no: 3, nama: "Pembelian Alat Musik untuk Ekstrakurikuler", jumlah: "1.000.000", doc: "Perawatan dan Renovasi Infrastruktur.pdf", status: "Di Setujui", tanggal: "21/01/2024" },
    { no: 4, nama: "Pemasangan AC di Ruang Guru", jumlah: "1.000.000", doc: "Pembangunan Baru.pdf", status: "Di Setujui", tanggal: "21/01/2024" },
    { no: 5, nama: "Penyediaan Dana Darurat Sekolah", jumlah: "1.000.000", doc: "Operasional Sekolah.pdf", status: "Di Setujui", tanggal: "21/01/2024" },
  ];

  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tanggal.includes(searchTerm)
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Status RAB</h1>
        <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
      </header>
      <main className="px-6 pb-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4 flex justify-between">
            <div className="text-xs sm:text-base">
              <label className="mr-2">Tampilkan</label>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <label className="ml-2">Entri</label>
            </div>

            <div className="border border-gray-300 rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56">
              <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
              <input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead className="text-[var(--text-semi-bold-color)]">
                <tr>
                  <th className="py-2 px-4 border-b text-left">No</th>
                  <th className="py-2 px-4 border-b text-left">Nama</th>
                  <th className="py-2 px-4 border-b text-left">Jumlah Dana</th>
                  <th className="py-2 px-4 border-b text-left">Doc Pengajuan RAB</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                    <td className="py-2 px-4 border-b">{item.no}</td>
                    <td className="py-2 px-4 border-b">{item.nama}</td>
                    <td className="py-2 px-4 border-b">{item.jumlah}</td>
                    <td className="py-2 px-4 border-b">{item.doc}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-6 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          item.status === "Di Setujui"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{item.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-5">
            <span className="text-xs sm:text-base">Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[var(--main-color)]"
              >
                &lt;
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                  const pageNumber = currentPage + index;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`rounded-md px-3 py-1 ${currentPage === pageNumber ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-[var(--main-color)]"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
