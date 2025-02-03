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

export default function TeacherRequestGoodsPage() {
  const [teacher, setTeacher] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { inventories } = useInventory();
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);


  const [formData, setFormData] = useState({
    role: "",
    inventoryId: 0,
    procurementName: "",
    quantity: "",
    procurementDate: "",
    documentPath: "",
  });

  const { createProcurement } = useProcurements();

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Teacher"]);
        setIsAuthorized(true);

        const userId = getUserIdFromToken();
        if (userId) {
          fetchTeacherData(Number(userId));
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
      formDataToSubmit.append("inventoryId", selectedInventory?.id.toString() || "");
      formDataToSubmit.append("role", teacher.role);
      formDataToSubmit.append("procurementName", teacher.name);
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

  if (!isAuthorized) {
    return <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan Barang</h1>
        <p className="text-sm text-gray-600">
          Halo, selamat datang di halaman Pengajuan Barang
        </p>
      </header>

      <main className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Informasi Detail Pengajuan</span>
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
                >
                  <option value="">Pilih Barang</option>
                  {inventories.map((inventory) => (
                    <option key={inventory.id} value={inventory.id}>
                      {inventory.name} (Stok: {inventory.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* ... kode form lainnya ... */}

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
                  {/* Tambahkan informasi inventory lainnya jika diperlukan */}
                </div>
              )}

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm hidden font-medium text-gray-700"
                >
                  Posisi Sebagai
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  placeholder="Guru"
                  className="mt-1 block w-full hidden rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="procurementName"
                  className="block text-sm hidden font-medium text-gray-700"
                >
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  id="procurementName"
                  name="procurementName"
                  value={formData.procurementName}
                  placeholder="John Doe"
                  className="mt-1 block w-full hidden rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
              </div>

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
                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
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
            <div className="mb-4"></div>{" "}
            {/* Menambahkan margin-bottom untuk memberikan ruang */}
            <h2 className="text-lg font-bold text-center mb-2">
              Ajukan Pengajuan Barang Dengan Mudah!
            </h2>
            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih
              Cepat!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
