"use client";

import "@/app/styles/globals.css";
import { useEffect, useRef } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { Chart, registerables } from "chart.js";

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

export default function MonthlyFinancesPage() {
  useEffect(() => {
    roleMiddleware(["Finance"]);
  }, []);

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((item) => item.month), // Menggunakan bulan sebagai label
          datasets: [
            {
              label: "Jumlah (Rp)",
              data: data.map((item) => item.quantity), // Menggunakan jumlah rupiah
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
            Keuangan Bulanan
          </h1>
          <p className="text-sm text-gray-600">
            Halo role Keuangan, selamat datang kembali
          </p>
        </div>
      </header>

      <main className="px-9 pb-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <canvas ref={chartRef} className="w-full h-60" />
        </div>
      </main>
    </div>
  );
}
