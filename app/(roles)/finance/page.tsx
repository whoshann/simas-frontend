"use client";

import "@/app/styles/globals.css";
import { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useDashboardFinance } from "@/app/hooks/useDashboardFinance";
import { formatDate, formatRupiah } from "@/app/utils/helper";
import { useUser } from "@/app/hooks/useUser";
import { budgetManagementApi } from "@/app/api/budget-management";
export default function FinanceDashboardPage() {
  const { dashboardData, loading } = useDashboardFinance();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Finance"]);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error initializing page:", error);
        setIsAuthorized(false);
      }
    };

    initializePage();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isAuthorized) return null;

  const handleViewPDF = async (filename: string) => {
    try {
      console.log("Mencoba mengakses file:", filename);
      const blob = await budgetManagementApi.getDocument(filename);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      alert(
        "Gagal mengambil file PDF: " +
          (error.response?.data?.message || "File tidak ditemukan")
      );
      console.error("Error fetching PDF:", error);
    }
  };

  const handleDownloadPDF = async (filename: string) => {
    try {
      const blob = await budgetManagementApi.getDocument(filename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal mengunduh file PDF");
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="pt-6 pb-0 px-9">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
            Beranda
          </h1>
          <p className="text-sm text-gray-600">
            Halo {user?.username}, selamat datang kembali
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
              <h3 className="text-lg font-semibold">Total Keuangan</h3>
              <p className="text-2xl font-bold">
                {formatRupiah(dashboardData.totalBalance)}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(dashboardData.lastBalanceUpdate)}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <div className="bg-[#e88e1f29] rounded-full p-3 mb-2 w-12 h-12 flex items-center justify-center">
                <i className="bx bxs-download text-[#e88d1f] text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold">Total Pemasukan</h3>
              <p className="text-2xl font-bold">
                {formatRupiah(dashboardData.totalIncome)}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(dashboardData.lastIncomeUpdate)}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <div className="bg-[#bd000025] rounded-full p-3 mb-2 w-12 h-12 flex items-center justify-center">
                <i className="bx bxs-cart text-[#bd0000] text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold">Total Pengeluaran</h3>
              <p className="text-2xl font-bold">
                {formatRupiah(dashboardData.totalExpenses)}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(dashboardData.lastExpenseUpdate)}
            </p>
          </div>
        </div>
        {/* End Cards */}

        {/* Tabel RAB */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4 flex justify-between">
            <div className="">
              <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Data RAB
              </span>
            </div>

            {/*Start Search */}
            <div className="border border-gray-300 rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56">
              <i className="bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2"></i>
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
                  <th className="py-2 px-4 border-b text-left">
                    Alasan Pengajuan
                  </th>
                  <th className="py-2 px-4 border-b text-left">
                    Dokumen Pendukung
                  </th>
                  <th className="py-2 px-4 border-b text-left">Tanggal</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.budgetRequests.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="py-1 px-2 border-b">{index + 1}</td>
                    <td className="py-1 px-2 border-b">{item.user.username}</td>
                    <td className="py-1 px-2 border-b">{item.user.role}</td>
                    <td className="py-1 px-2 border-b">{item.title}</td>
                    <td className="py-1 px-2 border-b">
                      {formatRupiah(item.total_budget)}
                    </td>
                    <td className="py-1 px-2 border-b">{item.description}</td>
                    <td className="py-1 px-2 border-b">
                      <button
                        onClick={() => handleViewPDF(item.document_path)}
                        className="text-blue-500 underline mr-2"
                      >
                        Lihat PDF
                      </button>
                      {" | "}
                      <button
                        onClick={() => handleDownloadPDF(item.document_path)}
                        className="text-blue-500 underline"
                      >
                        Unduh PDF
                      </button>
                    </td>
                    <td className="py-1 px-2 border-b">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="py-1 px-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Submitted"
                            ? "bg-[#e88e1f29] text-[var(--second-color)]"
                            : item.status === "Approved"
                            ? "bg-[#0a97b022] text-[var(--third-color)]"
                            : "bg-red-100 text-[var(--fourth-color)]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {dashboardData.budgetRequests.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-4">Tidak ada data</td>
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
