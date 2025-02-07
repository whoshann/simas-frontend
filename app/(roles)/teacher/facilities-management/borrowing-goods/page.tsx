"use client";

import React from 'react';
import "@/app/styles/globals.css";
import Image from 'next/legacy/image';
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { getUserIdFromToken } from '@/app/utils/tokenHelper';
import { authApi } from '@/app/api/auth';
import { useInventory } from '@/app/hooks/useInventory';
import { outgoingGoodsApi } from "@/app/api/outgoing-goods";
import { OutgoingGoodsRequest } from '@/app/api/outgoing-goods/types';
import { GuaranteeOutgoingGoods } from '@/app/utils/enums';
import { getGuaranteeOutgoingGoodsLabel } from '@/app/utils/enumHelpers';
import { showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";

export default function TeacherBorrowingGoodsPage() {
  const [teacher, setTeacher] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { inventories, fetchInventories } = useInventory();
  const { inventories: allInventories } = useInventory();

  const [formData, setFormData] = useState({
    role: '',
    borrowerName: '',
    inventoryId: 0,
    quantity: 1,
    borrowDate: '',
    returnDate: '',
    reason: '',
    guarantee: GuaranteeOutgoingGoods.KTP
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Teacher"]);
        setIsAuthorized(true);
        await fetchInventories();

        const userId = getUserIdFromToken();
        if (userId) {
          fetchTeacherData(Number(userId));
        }
      } catch (error) {
        console.error("Auth error:", error);
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
      setTeacher(response.data);
    } catch (err) {
      console.error("Error fetching teacher data:", err);
      setError("Failed to fetch teacher data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      const selectedInventory = inventories.find(
        inv => inv.id === Number(formData.inventoryId)
      );

      if (selectedInventory && parseInt(value) > selectedInventory.stock) {
        showErrorAlert(`Stok tidak mencukupi, ${selectedInventory.name} hanya tersedia sebanyak ${selectedInventory.stock}`);
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedInventory = inventories.find(
      inv => inv.id === Number(formData.inventoryId)
    );

    if (selectedInventory && Number(formData.quantity) > selectedInventory.stock) {
      showErrorAlert(`Stok tidak mencukupi, ${selectedInventory.name} hanya tersedia sebanyak ${selectedInventory.stock}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const borrowingData = {
        role: teacher?.role || '',
        inventoryId: Number(formData.inventoryId),
        borrowerName: teacher?.name || '',
        borrowDate: formData.borrowDate,
        returnDate: formData.returnDate,
        quantity: Number(formData.quantity),
        reason: formData.reason,
        guarantee: formData.guarantee
      };

      await outgoingGoodsApi.create(borrowingData as OutgoingGoodsRequest);

      setFormData({
        role: '',
        borrowerName: '',
        inventoryId: 0,
        quantity: 1,
        borrowDate: '',
        returnDate: '',
        reason: '',
        guarantee: GuaranteeOutgoingGoods.KTP
      });

      showSuccessAlert('Peminjaman berhasil diajukan!');

    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Gagal mengajukan peminjaman');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-bold-color)]">Peminjaman Barang</h1>
        <p className="text-sm text-[var(--text-thin-color)]">Halo {teacher.name}, selamat datang kembali</p>
      </header>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--main-color)] text-white rounded-lg p-6 flex flex-col justify-center items-center">
            <Image
              src="/images/student-borrowing-goods.png"
              alt="Ilustrasi Siswa"
              className="mb-4 rounded w-1/2"
              width={300}
              height={300}
            />
            <h2 className="text-lg font-bold mb-2 text-center mt-4 text-white">Ajukan Peminjaman Barangmu Dengan Mudah!</h2>

            <p className="text-center">
              Pastikan Data Yang Kamu Isi Sudah Benar Untuk Proses Yang Lebih Cepat!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2 text-[var(--text-semi-bold-color)]">Informasi Detail Peminjaman</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="inventoryId" className="block text-sm font-medium text-gray-700">
                  Pilih Barang yang dipinjam
                </label>
                <select
                  id="inventoryId"
                  name="inventoryId"
                  value={formData.inventoryId}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 pr-10"
                  required
                >
                  <option value="">Pilih Barang</option>
                  {allInventories.map((inventory) => (
                    <option key={inventory.id} value={inventory.id}>
                      {inventory.name} - Stok: {inventory.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Masukkan Jumlah Barang
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="borrowDate" className="block text-sm font-medium text-gray-700">
                    Tanggal Peminjaman
                  </label>
                  <input
                    type="date"
                    id="borrowDate"
                    name="borrowDate"
                    value={formData.borrowDate}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                    Tanggal Pengembalian
                  </label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Alasan Peminjaman
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Masukkan alasan peminjaman"
                  className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="guarantee" className="block text-sm font-medium text-gray-700">
                  Pilih jaminan
                </label>
                <select
                  id="guarantee"
                  name="guarantee"
                  value={formData.guarantee}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 pr-10"
                  required
                >
                  <option value={GuaranteeOutgoingGoods.KTP}>
                    {getGuaranteeOutgoingGoodsLabel(GuaranteeOutgoingGoods.KTP)}
                  </option>
                  <option value={GuaranteeOutgoingGoods.Handphone}>
                    {getGuaranteeOutgoingGoodsLabel(GuaranteeOutgoingGoods.Handphone)}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2154a1] disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Ajukan Peminjaman'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
