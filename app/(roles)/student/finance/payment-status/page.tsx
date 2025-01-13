
"use client";
import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware"; 
import PaymentSppModal from "@/app/components/PaymentSppModal.js";
// Import modal

export default function StudentPaymentStatusPage() {
  useEffect(() => {
    roleMiddleware(["Student"]);
  }, []);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('Januari');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const data = [
    { no: 1, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 1, status: "Lunas", tanggal: "21/01/2024" },
    { no: 2, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 2, status: "Lunas", tanggal: "21/02/2024" },
    { no: 3, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 3, status: "Lunas", tanggal: "21/03/2024" },
    { no: 4, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 4, status: "Lunas", tanggal: "21/04/2024" },
    { no: 5, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 5, status: "Belum Dibayar", tanggal: "Bayar" },
    { no: 6, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 6, status: "Belum Dibayar", tanggal: "21/06/2024" },
    { no: 7, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 7, status: "Lunas", tanggal: "21/07/2024" },
    { no: 8, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 8, status: "Belum Dibayar", tanggal: "21/08/2024" },
    { no: 9, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 9, status: "Lunas", tanggal: "21/09/2024" },
    { no: 10, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 10, status: "Belum Dibayar", tanggal: "21/10/2024" },
    { no: 11, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 11, status: "Lunas", tanggal: "21/11/2024" },
    { no: 12, nis: "009919828231", kelas: "XI RPL A", jumlah: "100.000", month: 12, status: "Belum Dibayar", tanggal: "21/12/2024" },
  ];

  const filteredData = data.filter(item => 
    item.month <= months.indexOf(selectedMonth) + 1 ||
    item.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tanggal.includes(searchTerm)
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pembayaran SPP</h1>
        <div className="relative mt-4 sm:mt-0 w-full sm:w-72">
          <div
            className="bg-white shadow-md rounded-lg py-4 px-7 flex items-center cursor-pointer"
            onClick={togglePanel}
          >
            <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
              <i className="bx bxs-calendar text-[#1f509a] text-3xl"></i>
            </div>
            <div className="flex-1">
              <span className="text-lg font-semibold">Filter Bulan</span>
              <p className="text-sm text-gray-600">{selectedMonth}</p>
            </div>
            <svg
              className={`ml-7 h-4 w-4 transform transition-transform ${
                isPanelOpen ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {isPanelOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
              {months.map((month) => (
                <div
                  key={month}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsPanelOpen(false);
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className="px-6 pb-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead className="text-[var(--text-semi-bold-color)]">
                <tr>
                  <th className="py-2 px-4 border-b text-left">No</th>
                  <th className="py-2 px-4 border-b text-left">NIS</th>
                  <th className="py-2 px-4 border-b text-left">Kelas</th>
                  <th className="py-2 px-4 border-b text-left">Jumlah</th>
                  <th className="py-2 px-4 border-b text-left">Bulan</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{item.no}</td>
                    <td className="py-2 px-4 border-b">{item.nis}</td>
                    <td className="py-2 px-4 border-b">{item.kelas}</td>
                    <td className="py-2 px-4 border-b">{item.jumlah}</td>
                    <td className="py-2 px-4 border-b">{item.month}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-6 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          item.status === "Lunas"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDetailClick(item)}
                      className="bg-[var(--main-color)] text-white px-4 py-2 rounded-lg text-sm block mx-auto max-w-full sm:max-w-fit"
                    >
                      Lihat Detail
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <PaymentSppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentData={selectedDetail}
      />
    </div>
  );
}
