"use client";

import "@/app/styles/globals.css";
import { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useDashboardFinance } from "@/app/hooks/useDashboardFinance";
import { formatDate, formatRupiah } from "@/app/utils/helper";
import { useUser } from "@/app/hooks/useUser";
import { budgetManagementApi } from "@/app/api/budget-management";
import { BudgetManagementStatusLabel } from "@/app/utils/enumHelpers";
import { showErrorAlert, showSuccessAlert, showConfirmDelete } from "@/app/utils/sweetAlert";

export default function FinanceDashboardPage() {
  const { dashboardData, loading } = useDashboardFinance();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);


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
      await showErrorAlert('Error', 'Gagal mengambil file PDF: ' + (error.response?.data?.message || "File tidak ditemukan"));
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
      await showErrorAlert('Error', 'Gagal mengunduh file PDF');
      console.error("Error downloading PDF:", error);
    }
  };

  const filteredData = dashboardData.budgetRequests.filter(item =>
    item.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.created_at && formatDate(item.created_at).toLowerCase().includes(searchTerm.toLowerCase())) ||
    formatRupiah(item.total_budget).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);


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

        <div className="mb-5">
          <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]">
            Data RAB
          </span>
        </div>

        {/* Tabel RAB */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
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

            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
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
                {currentEntries.map((item, index) => (
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
                        className="text-[var(--main-color)] underline mr-2"
                      >
                        Lihat PDF
                      </button>
                      {" | "}
                      <button
                        onClick={() => handleDownloadPDF(item.document_path)}
                        className="text-[var(--third-color)] underline"
                      >
                        Unduh PDF
                      </button>
                    </td>
                    <td className="py-1 px-2 border-b">
                      {formatDate(item.created_at || '')}
                    </td>
                    <td className="py-1 px-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Submitted"
                          ? "bg-[#1f509a26] text-[var(--main-color)]"
                          : item.status === "Approved"
                            ? "bg-[#0a97b022] text-[var(--third-color)]"
                            : item.status === "Revised" ? "bg-[#e88e1f29] text-[var(--second-color)]"
                            : "bg-[#bd000025] text-[var(--fourth-color)]"
                          }`}
                      >
                        {BudgetManagementStatusLabel[item.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {currentEntries.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-4">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-5">
            <span className="text-xs sm:text-sm">
              Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
            </span>

            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[var(--main-color)]"
              >
                &lt;
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-md px-3 py-1 ${currentPage === page
                      ? 'bg-[var(--main-color)] text-white'
                      : 'text-[var(--main-color)]'
                      }`}
                  >
                    {page}
                  </button>
                ))}
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
        {/* End Tabel RAB */}
      </main>
    </div>
  );
}
