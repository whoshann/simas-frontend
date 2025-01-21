"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { error } from "console";

const formatRupiah = (angka: string) => {
  const number = angka.replace(/[^,\d]/g, '').toString();
  const split = number.split(',');
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
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
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [jumlahDana, setJumlahDana] = useState('');
  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    title: '',
    description: '',
    total_budget: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Facilities"]);
        setIsAuthorized(true);
        
        const id = getUserIdFromToken();
        if (id) {
          setUserId(id);
          setFormData(prev => ({
            ...prev,
            userId: Number(id)
          }));
        }
      } catch (error) {
        console.error("Error initializing page:", error);
        setIsAuthorized(false);
      }
    };

    initializePage();
  }, []);

  if (loading) {
        return (
            <LoadingSpinner />
        );
    }

  if (!isAuthorized) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJumlahDanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = numericValue ? formatRupiah(numericValue) : '';
    setJumlahDana(formattedValue);
    // Update formData dengan nilai numerik
    setFormData(prev => ({
      ...prev,
      total_budget: Number(numericValue)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Hanya file PDF yang diperbolehkan');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append('userId', formData.userId.toString());
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('total_budget', formData.total_budget.toString());

    if (selectedFile) {
      submitFormData.append('document_path', selectedFile);
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/budget-estimate-plan`,
        submitFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) { // Menggunakan HTTP status code 201 Created
            // Reset semua input
            setFormData({
                userId: formData.userId,
                title: '',
                description: '',
                total_budget: 0
            });
            setSelectedFile(null);
            setJumlahDana('');

            // Reset file input
            const fileInput = document.getElementById('document_path') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            alert('Pengajuan RAB berhasil dikirim!');
        }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Gagal mengirim pengajuan RAB');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan RAB</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Pengajuan RAB</p>
      </header>

      {/* Breadcrumb Section */}
      <div className="px-9 mb-6">
        <nav className="flex text-sm font-medium text-gray-600">
          <a href="/" className="text-gray-400 hover:text-blue-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/sarpras-pengajuan" className="text-gray-800 font-semibold hover:text-blue-600">Pengajuan RAB</a>
        </nav>
      </div>

      {/* Alert Section */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-6 py-4 mx-9 flex items-start mb-6">
        <i className="bx bx-info-circle text-2xl mr-3"></i>
        <div>
          <p className="text-sm font-medium">
            Untuk mempermudah proses pengajuan RAB, silakan baca panduan lengkap terlebih dahulu.
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
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
        </div>
      </main>
    </div>
  );
}
