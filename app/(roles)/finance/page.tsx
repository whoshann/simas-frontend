"use client";

import "@/app/styles/globals.css";
import { useState, useEffect, useRef } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { Chart, registerables } from "chart.js";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";

Chart.register(...registerables);

const data = [
  { month: "Januari", quantity: 50000000 },
  { month: "Februari", quantity: 40000000 },
  { month: "Maret", quantity: 60000000 },
  { month: "April", quantity: 30000000 },
  { month: "Mei", quantity: 70000000 },
  { month: "Juni", quantity: 20000000 },
  { month: "Juli", quantity: 80000000 },
  { month: "Agustus", quantity: 45000000 },
  { month: "September", quantity: 35000000 },
  { month: "Oktober", quantity: 55000000 },
  { month: "November", quantity: 65000000 },
  { month: "Desember", quantity: 75000000 },
];

export default function FinanceDashboardPage() {

  const fetchDataAuth = async () => {
    try {
      // Set default Authorization header dengan Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch data user dari endpoint API
      const response = await axios.get("http://localhost:3333/users");
      setUser(response.data); // Simpan data user ke dalam state
    } catch (err: any) {
      console.error("Error saat fetching data:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false); // Set loading selesai
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const token = Cookies.get("token");
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  useEffect(() => {
    roleMiddleware(["Finance", "SuperAdmin"]);

    fetchDataAuth()

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: "Jumlah (Rp)",
              data: data.map((item) => item.quantity),
              backgroundColor: "#1F509A",
              borderRadius: 5,
              barThickness: 30,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jumlah (Rp)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Bulan",
              },
            },
          },
        },
      });
    }

    return () => {
      if (ctx) {
        Chart.getChart(ctx)?.destroy();
      }
    };
  }, []);

if (loading) {
    return <LoadingSpinner />;
}

if (error) {
    return <p className="text-red-500">{error}</p>;
}

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
            Beranda
          </h1>
          <p className="text-sm text-gray-600">
            Halo role keuangan, selamat datang kembali
          </p>
        </div>
        <div className="relative mt-4 sm:mt-0 w-full sm:w-72">
          <div
            className="bg-white shadow-md rounded-lg py-4 px-7 flex items-center cursor-pointer"
            onClick={togglePanel}
          >
            <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
              <i className="bx bxs-calendar text-[#1f509a] text-3xl"></i>
            </div>
            <div className="flex-1">
              <span className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Filter Bulan
              </span>
              <p className="text-sm text-gray-600">
                {selectedMonth} {selectedYear}
              </p>
            </div>
            <svg
              className={`ml-7 h-4 w-4 transform transition-transform ${isPanelOpen ? "rotate-90" : ""
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
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
                  {month} {selectedYear}
                </div>
              ))}
            </div>
          )}
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
              <p className="text-2xl font-bold">Rp.150.000.000,00</p>
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
              <p className="text-2xl font-bold">Rp.150.000.000,00</p>
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
              <p className="text-2xl font-bold">Rp.150.000.000,00</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Terakhir Diperbarui pada Tanggal:
            </p>
            <p className="text-sm text-gray-600">25/12/2024</p>
          </div>
        </div>
        {/* End Cards */}

        {/* Start Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold">Keuangan Bulanan</h3>
          <canvas ref={canvasRef} className="w-full h-60" />
        </div>
        {/* End Chart */}
      </main>
    </div>
  );
}
