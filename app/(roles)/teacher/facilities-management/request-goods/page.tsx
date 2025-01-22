"use client";

import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { authApi } from "@/app/api/auth";
import { ProcurementStatus } from "@/app/utils/enums";
import axios from "axios";
import Cookies from "js-cookie";

export default function TeacherRequestGoodsPage() {
  const [teacher, setTeacher] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    procurementName: "",
    itemName: "",
    unitPrice: "",
    quantity: "",
    totalPrice: "",
    supplier: "",
    procurementDate: "",
  });

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

  const formatRupiah = (angka: string): string => {
    const number = angka.replace(/[^,\d]/g, "");
    const split = number.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return `Rp ${rupiah}${split[1] ? "," + split[1] : ""}`;
  };

  const parseRupiah = (value: string): number =>
    parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    setFormData((prev) => {
      const updatedData = { ...prev };

      if (name === "unitPrice") {
        const formattedUnitPrice = formatRupiah(numericValue);
        updatedData.unitPrice = formattedUnitPrice;
        updatedData.totalPrice = formatRupiah(
          (parseRupiah(numericValue) * parseInt(prev.quantity || "1")).toString()
        );
      } else if (name === "quantity") {
        const unitPriceNumeric = parseRupiah(prev.unitPrice || "0");
        updatedData.quantity = value;
        updatedData.totalPrice = formatRupiah(
          (unitPriceNumeric * parseInt(value || "1")).toString()
        );
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const procurementData = {
        role: teacher.role,
        procurementName: teacher.name,
        itemName: formData.itemName,
        unitPrice: parseRupiah(formData.unitPrice),
        quantity: parseInt(formData.quantity, 10),
        totalPrice: parseRupiah(formData.totalPrice),
        supplier: formData.supplier,
        procurementDate: new Date(formData.procurementDate).toISOString(),
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/procurements`,
        procurementData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({
        role: "",
        procurementName: "",
        itemName: "",
        unitPrice: "",
        quantity: "",
        totalPrice: "",
        supplier: "",
        procurementDate: "",
      });

      alert("Pengajuan barang berhasil diajukan!");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Gagal mengajukan pengajuan barang");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan Barang</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Pengajuan Barang</p>
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
                <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="Laptop Lenovo Yoga 7i"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
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
                    onChange={handlePriceChange}
                    placeholder="3"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="unitPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga Satuan
                  </label>
                  <input
                    type="text"
                    id="unitPrice"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handlePriceChange}
                    placeholder="Rp 0"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Harga
                  </label>
                  <input
                    type="text"
                    id="totalPrice"
                    name="totalPrice"
                    value={formData.totalPrice}
                    readOnly
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="supplier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pemasok
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="PT. Sinar Jaya"
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
                  onChange={(e) => setFormData({ ...formData, procurementDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                />
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
            <div className="mb-4"></div> {/* Menambahkan margin-bottom untuk memberikan ruang */}
            <h2 className="text-lg font-bold text-center mb-2">
              Ajukan Pengajuan Barang Dengan Mudah!
            </h2>
            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih Cepat!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
