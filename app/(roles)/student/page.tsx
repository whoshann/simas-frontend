"use client";

import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Script from 'next/script';
import { Chart, registerables } from 'chart.js';
import Cookies from "js-cookie";
import Image from 'next/image';
import axios from "axios";
import { useEffect, useState, useRef } from "react";

// Daftarkan semua komponen yang diperlukan
Chart.register(...registerables);

export default function StudentDashboard() {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  // console.log("Token:", token);

  const fetchData = async () => {
    try {
      // Set default Authorization header dengan Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch data user dari endpoint API
      const response = await axios.get("http://localhost:3333/student");
      setUser(response.data); // Simpan data user ke dalam state
    } catch (err: any) {
      console.error("Error saat fetching data:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false); // Set loading selesai
    }
  };

  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
    roleMiddleware(["Student", "SuperAdmin"]);

    // Panggil fungsi fetch data
    fetchData();
  }, []);

  if (loading) {
    return <p>Memuat data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-gray-800">Beranda</h1>
        <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 hide-scrollbar pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rekap Nilai */}
          <div className="bg-white shadow rounded-lg p-6 col-span-2 w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Rekap Nilai</h3>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Semester 1</option>
                <option>Semester 2</option>
              </select>
            </div>
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="w-full h-60" />
            </div>
            <Script
              src="https://cdn.jsdelivr.net/npm/chart.js"
              strategy="lazyOnload"
              onLoad={() => {
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) {
                  new Chart(ctx, {
                    type: "bar",
                    data: {
                      labels: [
                        "Agama",
                        "Matematika",
                        "PP",
                        "Sejarah",
                        "Bindo",
                        "Inggris",
                        "PJOK",
                        "Bahasa Jawa",
                      ],
                      datasets: [
                        {
                          label: "Nilai",
                          data: [80, 85, 90, 75, 88, 92, 70, 80],
                          backgroundColor: [
                            "#1F509A",
                            "#EC8306",
                            "#0A8DA5",
                            "#1F509A",
                            "#EC8306",
                            "#0A8DA5",
                            "#1F509A",
                            "#EC8306",
                          ],
                          borderRadius: 5,
                          barThickness: 15,
                        },
                      ],
                    },
                    options: {
                      responsive: true,
                      scales: {
                        y: { beginAtZero: true },
                        x: { type: "category" },
                      },
                    },
                  });
                }
              }}
            />
          </div>

          {/* Keuangan */}
          <div className="flex flex-col gap-6 col-span-1">
            <div className="bg-white shadow rounded-lg p-6 flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Keuangan</h3>
                <button className="bg-[#1F509A] text-white text-xs px-3 py-1 rounded-full">
                  Lihat Detail
                </button>
              </div>
              <ul className="space-y-2">
                <li className="text-sm flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-2 w-10 h-10 flex items-center justify-center">
                    <i className="bx bx-money text-xl" style={{ color: "#EC8306" }}></i>
                  </div>
                  <div>
                    <div>Kamu belum membayar SPP bulan Januari</div>
                    <span className="text-gray-500">19/01/2024</span>
                  </div>
                </li>

                <li className="text-sm flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-2 w-10 h-10 flex items-center justify-center">
                    <i className="bx bx-money text-xl" style={{ color: "#EC8306" }}></i>
                  </div>
                  <div>
                    <div>Kamu belum membayar SPP bulan Januari</div>
                    <span className="text-gray-500">19/01/2024</span>
                  </div>
                </li>
                
              </ul>
            </div>

            {/* Total Point Pelanggaran */}
            <div className="bg-white shadow rounded-lg p-6 flex-grow">
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-start mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <div className="w-14 h-14 rounded-full bg-[#1F509A] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">5</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-left text-gray-800">
                    Total Point Pelanggaran
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-left">
                  Tercatat ada 5 point pelanggaran yang kamu dapatkan. Jika
                  mencapai 100 point, kamu akan mendapatkan SP 3.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow rounded-lg overflow-hidden w-full">
            <div className="p-4">
              <Image
                src="/images/Berita1.jpg"
                alt="Sosialisasi Prakerin Orang Tua"
                className="w-full object-cover rounded-lg"
                width={500}
                height={300}
              />
            </div>
            <div className="p-4 flex">
              <div className="flex flex-col items-center justify-center pr-4">
                <span className="text-2xl font-bold text-blue-700">27</span>
                <span className="text-2xl font-semibold text-teal-600">01</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Sosialisasi Prakerin Orang Tua
                </h4>
                <p className="text-sm text-gray-600">
                  Sosialisasi terkait pemberangkatan prakerin untuk orang tua
                  siswa yang dilaksanakan di Home Theater jam 9 pagi tanggal 27
                  bulan Januari.
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Berita 2 */}
          <div className="bg-white shadow rounded-lg overflow-hidden w-full">
            <div className="p-4">
              <Image
                src="/images/Berita1.jpg"
                alt="Kegiatan Ekstrakurikuler"
                className="w-full object-cover rounded-lg"
                width={500}
                height={300}
              />
            </div>
            <div className="p-4 flex">
              <div className="flex flex-col items-center justify-center pr-4">
                <span className="text-2xl font-bold text-blue-700">15</span>
                <span className="text-2xl font-semibold text-teal-600">02</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Kegiatan Ekstrakurikuler
                </h4>
                <p className="text-sm text-gray-600">
                  Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Berita 3 */}
          <div className="bg-white shadow rounded-lg overflow-hidden w-full">
            <div className="p-4">
              <Image
                src="/images/Berita1.jpg"
                alt="Pendaftaran Siswa Baru"
                className="w-full object-cover rounded-lg"
                width={500}
                height={300}
              />
            </div>
            <div className="p-4 flex">
              <div className="flex flex-col items-center justify-center pr-4">
                <span className="text-2xl font-bold text-blue-700">01</span>
                <span className="text-2xl font-semibold text-teal-600">03</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Pendaftaran Siswa Baru
                </h4>
                <p className="text-sm text-gray-600">
                  Pendaftaran siswa baru akan dibuka mulai tanggal 1 Maret.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}