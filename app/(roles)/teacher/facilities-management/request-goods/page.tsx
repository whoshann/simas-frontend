"use client";

import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { authApi } from "@/app/api/auth";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useProcurements } from "@/app/hooks/useProcurements";
import { Inventory } from "@/app/api/inventories/types";
import { useInventory } from "@/app/hooks/useInventory";
import { showSuccessAlert, showErrorAlert } from '@/app/utils/sweetAlert';
import { ProcurementStatus } from "@/app/utils/enums";
import { procurementsApi } from "@/app/api/procurement";

interface TeacherState {
  id?: number;
  name?: string;
  role?: string;
  [key: string]: any;
}

export default function TeacherRequestGoodsPage() {
  const [teacher, setTeacher] = useState<TeacherState>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { inventories } = useInventory();
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const { procurements, loading: procurementsLoading, fetchProcurements, createProcurement } = useProcurements();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<{ [key: number]: boolean }>({});

  const [formData, setFormData] = useState({
    role: "",
    inventoryId: 0,
    procurementName: "",
    quantity: "",
    procurementDate: new Date().toISOString().split('T')[0],
    documentPath: "",
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Teacher"]);
        setIsAuthorized(true);

        const userId = getUserIdFromToken();
        if (userId) {
          await fetchTeacherData(Number(userId));
        }
      } catch (err) {
        console.error("Auth error:", err);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (teacher.id) {
      fetchProcurements();
    }
  }, [teacher.id, fetchProcurements]);

  const fetchTeacherData = async (userId: number) => {
    try {
      const response = await authApi.getTeacherLogin(userId);
      setTeacher({ ...response.data, role: "Teacher" });
    } catch (err) {
      console.error("Error fetching teacher data:", err);
      setError("Failed to fetch teacher data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSubmit = new FormData();

      // Append semua field ke FormData
      formDataToSubmit.append("inventoryId", selectedInventory?.id?.toString() || "");
      formDataToSubmit.append("role", teacher.role || "");
      formDataToSubmit.append("procurementName", teacher.name || "");
      formDataToSubmit.append("quantity", formData.quantity);
      formDataToSubmit.append("procurementDate", new Date(formData.procurementDate).toISOString());

      // Append file
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formDataToSubmit.append("documentPath", fileInput.files[0]);
      }

      await createProcurement(formDataToSubmit);

      setFormData({
        role: "",
        inventoryId: 0,
        procurementName: "",
        quantity: "",
        procurementDate: "",
        documentPath: "",
      });
      setSelectedInventory(null);

      await showSuccessAlert('Berhasil', 'Pengajuan barang berhasil diajukan');
    } catch (err: any) {
      console.error("Error submitting form:", err);
      await showErrorAlert('Error', 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan teacherId dan search term
  const filteredData = procurements.filter((item) => {
    const matchesTeacher = item.procurementName === teacher.name;
    const searchMatch =
      item.inventory?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quantity?.toString().includes(searchTerm) ||
      new Date(item.procurementDate).toLocaleDateString('id-ID').includes(searchTerm) ||
      item.procurementStatus?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTeacher && (searchTerm === "" || searchMatch);
  });

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const getStatusLabel = (status: ProcurementStatus) => {
    switch (status) {
      case ProcurementStatus.Pending:
        return "Menunggu";
      case ProcurementStatus.Approved:
        return "Disetujui";
      case ProcurementStatus.Rejected:
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusClass = (status: ProcurementStatus) => {
    switch (status) {
      case ProcurementStatus.Pending:
        return "bg-[#e88e1f29] text-[var(--second-color)]";
      case ProcurementStatus.Approved:
        return "bg-[#1f509a26] text-[var(--main-color)]";
      case ProcurementStatus.Rejected:
        return "bg-[#bd000025] text-[var(--fourth-color)]";
      default:
        return "";
    }
  };

  // Fungsi untuk toggle read more
  const toggleReadMore = (id: number) => {
    setExpandedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Component untuk message dengan read more
  const MessageWithReadMore = ({ message, id }: { message: string, id: number }) => {
    const MAX_LENGTH = 50; // Maksimum karakter yang ditampilkan
    const isExpanded = expandedMessages[id];
    const isLongMessage = message.length > MAX_LENGTH;

    return (
      <div className="text-sm">
        <p className={`${isExpanded ? '' : 'line-clamp-2'}`}>
          {isExpanded ? message : isLongMessage ? `${message.slice(0, MAX_LENGTH)}...` : message}
        </p>
        {isLongMessage && (
          <button
            onClick={() => toggleReadMore(id)}
            className="text-[var(--main-color)] hover:text-[var(--main-color)]/80 text-xs mt-1 focus:outline-none"
          >
            {isExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
          </button>
        )}
      </div>
    );
  };

  const handleViewPDF = async (filename: string) => {
    try {
      console.log('Mencoba mengakses file:', filename);
      const blob = await procurementsApi.getDocument(filename);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      await showErrorAlert('Error', 'Gagal mengambil file PDF: ' + (error.response?.data?.message || 'File tidak ditemukan'));
      console.error('Error fetching PDF:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!isAuthorized) {
    return <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>;
  }


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pengajuan Barang</h1>
        <p className="text-sm text-gray-600">Halo {teacher.name}, selamat datang kembali</p>
      </header>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Pengajuan Barang</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Barang
                </label>
                <select
                  id="itemName"
                  name="itemName"
                  value={selectedInventory?.id || ""}
                  onChange={(e) => {
                    const selected = inventories.find(
                      (inv) => inv.id === parseInt(e.target.value)
                    );
                    setSelectedInventory(selected || null);
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                >
                  <option value="">Pilih Barang</option>
                  {inventories.map((inventory) => (
                    <option key={inventory.id} value={inventory.id}>
                      {inventory.name} (Stok: {inventory.stock})
                    </option>
                  ))}
                </select>
              </div>

              {selectedInventory && (
                <div className="bg-blue-50 p-4 rounded-md mt-4">
                  <h3 className="text-sm font-medium text-blue-800">
                    Detail Barang:
                  </h3>
                  <p className="text-sm text-blue-600">
                    Nama: {selectedInventory.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    Stok Tersedia: {selectedInventory.stock}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jumlah Barang
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: e.target.value,
                    })
                  }
                  placeholder="3"
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="procurementDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Pengajuan Barang
                </label>
                <input
                  type="date"
                  id="procurementDate"
                  name="procurementDate"
                  value={formData.procurementDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      procurementDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="documentPath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Pengajuan (PDF)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="file"
                    id="documentPath"
                    name="documentPath"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          documentPath: file.name,
                        });
                      }
                    }}
                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="bg-[var(--main-color)] text-white rounded-lg p-6 flex flex-col justify-center items-center">
            <Image
              src="/images/pengajuan-barang.svg"
              alt="Ilustrasi Pengajuan"
              className="mb-4 w-1/2"
              width={500}
              height={300}
            />
            <div className="mb-4"></div>
            <h2 className="text-lg font-bold text-center mb-2">
              Ajukan Pengajuan Barang Dengan Mudah!
            </h2>
            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih Cepat!
            </p>
          </div>

          {/* Table Section */}
          <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm">
                <label className="mr-2">Tampilkan</label>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-1 text-sm"
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

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-[var(--text-semi-bold-color)]">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                    <th className="py-2 px-4 border-b text-left">Tanggal Pengajuan</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left tracking-wider w-1/4">Alasan</th>
                    <th className="py-2 px-4 border-b text-left">Dokumen</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.inventory?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.procurementDate).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full ${getStatusClass(item.procurementStatus)}`}>
                          {getStatusLabel(item.procurementStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal max-w-xs">
                        <MessageWithReadMore
                          message={item.updateMessage || '-'}
                          id={item.id}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleViewPDF(item.documentPath)}
                          className="text-[var(--main-color)] underline mr-2"
                        >
                          Lihat Dokumen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md text-sm text-[var(--main-color)] disabled:opacity-50"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                      ? 'bg-[var(--main-color)] text-white'
                      : 'text-[var(--main-color)]'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md text-sm text-[var(--main-color)] disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}