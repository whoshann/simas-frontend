"use client";

import "@/app/styles/globals.css";
import { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";

export default function FinanceDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentEntries, setCurrentEntries] = useState<Array<{
    no: number;
    id: number;
    name: string;
    role: string;
    title: string;
    description: string;
    amount: number;
    document: string;
    date: string;
    status: string;
  }>>([
    {
      no: 1,
      id: 1,
      name: "John Doe",
      role: "Kesiswaan",
      title: "Renovation of Computer Lab",
      amount: 20000000,
      description: "Repair of lab facilities",
      document: "Proposal_Renovation_Lab.pdf",
      date: "15/12/2024",
      status: "Menunggu",
    },
    {
      no: 2,
      id: 2,
      name: "John Doe",
      role: "Kesiswaan",
      title: "Sports Equipment",
      amount: 5000000,
      description: "Procurement of balls and nets",
      document: "Proposal_Sports.pdf",
      date: "15/12/2024",
      status: "Menunggu",
    },
    {
      no: 3,
      id: 3,
      name: "John Doe",
      role: "Kesiswaan",
      title: "Student Workshop",
      amount: 15000000,
      description: "Robotics training for students",
      document: "Proposal_Workshop.pdf",
      date: "15/12/2024",
      status: "Menunggu",
    },
    {
      no: 4,
      id: 4,
      name: "John Doe",
      role: "Sarpras",
      title: "Book Procurement",
      amount: 3000000,
      description: "Library reference books",
      document: "Proposal_Books.pdf",
      date: "15/12/2024",
      status: "Disetujui",
    },
    {
      no: 5,
      id: 5,
      name: "John Doe",
      role: "Guru",
      title: "Building Maintenance",
      amount: 10000000,
      description: "Repair of classroom ceiling",
      document: "Proposal_Maintenance.pdf",
      date: "15/12/2024",
      status: "Ditolak",
    }
  ]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Finance"]);
        setIsAuthorized(true);
        setLoading(false)
      } catch (error) {
        console.error("Error initializing page:", error);
        setIsAuthorized(false);
      }
    };

    initializePage();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="pt-6 pb-0 px-9">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
            Beranda
          </h1>
          <p className="text-sm text-gray-600">
            Halo role keuangan, selamat datang kembali
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">
        {/* Start Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <div className="bg-[#1f509a27] rounded-full p-3 mb-2 w-12 h-12 flex items-center justify-center">
                <i className="bx bxs-bank text-[#1f509a] text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Total Keuangan
              </h3>
              <p className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Rp.150.000.000,00</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">25/12/2024</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <div className="bg-[#e88e1f29] rounded-full p-3 mb-2 w-12 h-12 flex items-center justify-center">
                <i className="bx bxs-download text-[#e88d1f] text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Total Pemasukan
              </h3>
              <p className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Rp.150.000.000,00</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">25/12/2024</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <div className="bg-[#bd000025] rounded-full p-3 mb-2 w-12 h-12 flex items-center justify-center">
                <i className="bx bxs-cart text-[#bd0000] text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Total Pengeluaran
              </h3>
              <p className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Rp.150.000.000,00</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">25/12/2024</p>
          </div>

        </div>
        {/* End Cards */}

        {/* Tabel RAB */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4 flex justify-between">
            <div className="">
              <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]">Data RAB</span>
            </div>

            {/*Start Search */}
            <div className="border border-gray-300 rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56">
              <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
              <input
                type="text"
                placeholder="Cari data..."
                className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
              />
            </div>
          </div>

          {/* Start Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead className="text-[var(--text-semi-bold-color)]">
                <tr>
                  <th className="py-2 px-4 border-b text-left">No</th>
                  <th className="py-2 px-4 border-b text-left">Nama</th>
                  <th className="py-2 px-4 border-b text-left">Peran</th>
                  <th className="py-2 px-4 border-b text-left">Rencana RAB</th>
                  <th className="py-2 px-4 border-b text-left">Dana</th>
                  <th className="py-2 px-4 border-b text-left">Alasan Pengajuan</th>
                  <th className="py-2 px-4 border-b text-left">Dokumen Pendukung</th>
                  <th className="py-2 px-4 border-b text-left">Tanggal</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                    <td className="py-1 px-2 border-b">{item.no}</td>
                    <td className="py-1 px-2 border-b">{item.name}</td>
                    <td className="py-1 px-2 border-b">{item.role}</td>
                    <td className="py-1 px-2 border-b">{item.title}</td>
                    <td className="py-1 px-2 border-b">Rp.{item.amount.toLocaleString()}</td>
                    <td className="py-1 px-2 border-b">{item.description}</td>
                    <td className="py-1 px-2 border-b">{item.document}</td>
                    <td className="py-1 px-2 border-b">{item.date}</td>
                    <td className="py-1 px-2 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Menunggu' ? 'bg-[#e88e1f29] text-[var(--second-color)]' :
                        item.status === 'Disetujui' ? 'bg-[#0a97b022] text-[var(--third-color)]' :
                        'bg-red-100 text-[var(--fourth-color)]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {currentEntries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-4">
                      Belum ada data RAB
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* End Tabel RAB */}
      </main>
    </div>
  );
}