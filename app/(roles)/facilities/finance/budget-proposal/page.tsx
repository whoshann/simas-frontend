"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { BudgetManagementStatus } from "@/app/utils/enums";
import { useBudgetManagement } from "@/app/hooks/useBudgetManagement";
import { formatDate } from "@/app/utils/helper";
import { budgetManagementApi } from "@/app/api/budget-management";

const formatRupiah = (angka: string) => {
  const number = angka.replace(/[^,\d]/g, "").toString();
  const split = number.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return `Rp ${rupiah}`;
};

interface FormData {
  userId: number;
  title: string;
  description: string;
  total_budget: number;
  document_path?: File;
}

export default function FacilitiesBudgetProposalPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [jumlahDana, setJumlahDana] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    title: "",
    description: "",
    total_budget: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { budgetManagement, loading, error, fetchBudgetManagementByUserId } =
    useBudgetManagement();

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Facilities"]);
        setIsAuthorized(true);

        const id = getUserIdFromToken();
        if (id) {
          setUserId(id);
          setFormData((prev) => ({
            ...prev,
            userId: Number(id),
          }));
        }
      } catch (error) {
        console.error("Error initializing page:", error);
        setIsAuthorized(false);
      }
    };

    fetchBudgetManagementByUserId();

    initializePage();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJumlahDanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue ? formatRupiah(numericValue) : "";
    setJumlahDana(formattedValue);

    // Update formData dengan nilai numerik
    setFormData((prev) => ({
      ...prev,
      total_budget: Number(numericValue) || 0,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Hanya file PDF yang diperbolehkan");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append("userId", formData.userId.toString());
    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("total_budget", formData.total_budget.toString());

    if (selectedFile) {
      submitFormData.append("document_path", selectedFile);
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/budget-estimate-plan`,
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        // Menggunakan HTTP status code 201 Created
        // Reset semua input
        setFormData({
          userId: formData.userId,
          title: "",
          description: "",
          total_budget: 0,
        });
        setSelectedFile(null);
        setJumlahDana("");

        // Reset file input
        const fileInput = document.getElementById(
          "document_path"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        alert("Pengajuan RAB berhasil dikirim!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal mengirim pengajuan RAB");
    }
  };

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
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan RAB</h1>
        <p className="text-sm text-gray-600">
          Halo, selamat datang di halaman Pengajuan RAB
        </p>
      </header>

      {/* Alert Section */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-6 py-4 mx-9 flex items-start mb-6">
        <i className="bx bx-info-circle text-2xl mr-3"></i>
        <div>
          <p className="text-sm font-medium">
            Untuk mempermudah proses pengajuan RAB, silakan baca panduan lengkap
            terlebih dahulu.
          </p>
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 hover:underline font-medium focus:outline-none"
          >
            Lihat Panduan
          </button>
        </div>
      </div>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Pengajuan RAB</span>
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Rencana Anggaran Biaya
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Gelar Karya Pembelajaran"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="total_budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jumlah Dana Yang Diajukan
                </label>
                <input
                  type="text"
                  id="total_budget"
                  name="total_budget"
                  value={jumlahDana}
                  onChange={handleJumlahDanaChange}
                  placeholder="Rp 600.000"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="document_path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Pengajuan RAB (PDF)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="file"
                    id="document_path"
                    name="document_path"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alasan Pengajuan Rencana Anggaran Biaya
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
              >
                Kirim
              </button>
            </form>
          </div>
          {/* Tabel Riwayat */}
          <div className="bg-white shadow-md rounded-lg p-6">
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

              <div className="flex space-x-2 mt-5 sm:mt-0"></div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden">
                <thead className="text-[var(--text-semi-bold-color)]">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Judul RAB</th>
                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                    <th className="py-2 px-4 border-b text-left">
                      Biaya Anggaran
                    </th>
                    <th className="py-2 px-4 border-b text-left">
                      Dokumen Pendukung
                    </th>
                    <th className="py-2 px-4 border-b text-left">
                      Tanggal Pengajuan
                    </th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Pesan</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetManagement.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 text-[var(--text-regular-color)]"
                    >
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.title}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.description}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {formatRupiah(item.total_budget.toString())}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
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
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {formatDate(item.created_at)}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.status === BudgetManagementStatus.Revised && (
                          <span className="bg-[#e88e1f29] text-[var(--second-color)] rounded-full px-4 py-2">
                            Revisi
                          </span>
                        )}
                        {item.status === BudgetManagementStatus.Approved && (
                          <span className="bg-[#0a97b022] text-[var(--third-color)] rounded-full px-4 py-2">
                            Disetujui
                          </span>
                        )}
                        {item.status === BudgetManagementStatus.Rejected && (
                          <span className="bg-red-100 text-[var(--fourth-color)] rounded-full px-4 py-2">
                            Ditolak
                          </span>
                        )}
                        {item.status === BudgetManagementStatus.Submitted && (
                          <span className="bg-[#e88e1f29] text-[var(--second-color)] rounded-full px-4 py-2">
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td
                        className="py-2 px-4 border-b"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.updateMessage || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
