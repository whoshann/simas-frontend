"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Script from 'next/script';
import { Chart, registerables } from 'chart.js';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';


// Daftarkan semua komponen yang diperlukan
Chart.register(...registerables);

export default function StudentDashboard() {
  // Panggil middleware dan hooks di awal komponen
  const [student, setStudent] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
        try {
            await roleMiddleware(["Student","SuperAdmin"]);
            setIsAuthorized(true);
        } catch (error) {
            console.error("Auth error:", error);
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    };

    initializePage();
  }, []);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
        <p className="text-sm text-[var(--text-thin-color)]">Halo {student.name}, selamat datang kembali</p>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 hide-scrollbar pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rekap Nilai */}
          <div className="bg-white shadow rounded-lg p-6 col-span-2 w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">Rekap Nilai</h3>
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
                <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">Keuangan</h3>
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
                  <h3 className="text-lg font-semibold text-left text-[var(--text-semi-bold-color)]">
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
        <Swiper
  ref={swiperRef}
  pagination={{ clickable: true }}
  autoplay={{ delay: 3000, disableOnInteraction: false }} 
  style={{ marginTop: '20px' }}
  slidesPerView={1}
  slidesPerGroup={1}
  centeredSlides={true}
  loop={true}
  effect={'slide'}
  breakpoints={{
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 1,
      centeredSlides: false,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      centeredSlides: false,
      spaceBetween: 15
    },
    0: { // Tambahkan ini untuk ponsel
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: true,
      spaceBetween: 10
    }
  }}
>

          {/* Kartu Berita */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita1.jpg"
                  alt="Sosialisasi Prakerin Orang Tua"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">27</span>
                  <span className="text-xl font-semibold text-teal-600">01</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Sosialisasi Prakerin Orang Tua
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Kartu Berita 2 */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita2.jpg"
                  alt="Kegiatan Ekstrakurikuler"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">15</span>
                  <span className="text-xl font-semibold text-teal-600">02</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Kegiatan Ekstrakurikuler
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Kartu Berita 3 */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita3.jpg"
                  alt="Pendaftaran Siswa Baru"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">01</span>
                  <span className="text-xl font-semibold text-teal-600">03</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Pendaftaran Siswa Baru
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Pendaftaran siswa baru akan dibuka mulai tanggal 1 Maret.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Kartu Berita 4 */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita4.jpg"
                  alt="Kegiatan Olahraga"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">10</span>
                  <span className="text-xl font-semibold text-teal-600">03</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Kegiatan Olahraga
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Kegiatan olahraga akan dilaksanakan pada tanggal 10 Maret.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Kartu Berita 5 */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita1.jpg"
                  alt="Pameran Seni"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">20</span>
                  <span className="text-xl font-semibold text-teal-600">04</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Pameran Seni
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Pameran seni akan dilaksanakan pada tanggal 20 April.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Kartu Berita 6 */}
          <SwiperSlide>
            <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto">
              <div className="relative h-48 md:h-56">
                <Image
                  src="/images/Berita3.jpg"
                  alt="Workshop Teknologi"
                  className="rounded-t-lg object-cover"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-4">
                  <span className="text-2xl font-bold text-blue-700">05</span>
                  <span className="text-xl font-semibold text-teal-600">05</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)] line-clamp-2">
                    Workshop Teknologi
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    Workshop teknologi akan dilaksanakan pada tanggal 5 Mei.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </main>
    </div>
  );
}
