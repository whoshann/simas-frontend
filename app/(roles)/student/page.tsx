"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Script from "next/script";
import { Chart, registerables } from "chart.js";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { NewsInformation } from "@/app/api/news-information/types";
import { useNewsInformation } from "@/app/hooks/useNewsInformation";
import { getTokenData } from "@/app/utils/tokenHelper";
import { authApi } from "@/app/api/auth";
import { useSchoolPayment } from "@/app/hooks/useSchoolPayment";
import { formatDate } from "@/app/utils/helper";
import { PaymentSpp } from "@/app/api/school-payment/types";
import { useViolation } from "@/app/hooks/useViolationData";

interface StudentState {
  role?: string;
  name?: string;
  [key: string]: any;
}

// Daftarkan semua komponen yang diperlukan
Chart.register(...registerables);

const newsData = [
  {
    id: 1,
    image: "/images/Berita1.jpg",
    title: "Sosialisasi Prakerin Orang Tua",
    date: { day: "27", month: "01" },
    description:
      "Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
  {
    id: 2,
    image: "/images/Berita2.jpg",
    title: "Kegiatan Ekstrakurikuler",
    date: { day: "15", month: "02" },
    description:
      "Kegiatan ekstrakurikuler akan dilaksanakan pada tanggal 15 Februari.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
  {
    id: 3,
    image: "/images/Berita3.jpg",
    title: "Pendaftaran Siswa Baru",
    date: { day: "01", month: "03" },
    description: "Pendaftaran siswa baru akan dibuka mulai tanggal 1 Maret.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
  {
    id: 4,
    image: "/images/Berita4.jpg",
    title: "Kegiatan Olahraga",
    date: { day: "10", month: "03" },
    description: "Kegiatan olahraga akan dilaksanakan pada tanggal 10 Maret.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
  {
    id: 5,
    image: "/images/Berita1.jpg",
    title: "Pameran Seni",
    date: { day: "20", month: "04" },
    description: "Pameran seni akan dilaksanakan pada tanggal 20 April.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
  {
    id: 6,
    image: "/images/Berita3.jpg",
    title: "Workshop Teknologi",
    date: { day: "05", month: "05" },
    description: "Workshop teknologi akan dilaksanakan pada tanggal 5 Mei.",
    note: "Catatan: Ini adalah catatan untuk kartu berita ini.",
  },
];

export default function StudentDashboard() {
  // Panggil middleware dan hooks di awal komponen
  const [student, setStudent] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { newsInformation, fetchNewsInformation } = useNewsInformation();
  const { paymentSpp, fetchPaymentSppByStudentId } = useSchoolPayment();
  const { violations, fetchViolationByStudentId, totalPoints } = useViolation();
  const [news, setNews] = useState<NewsInformation[]>([]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Student", "SuperAdmin"]);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    initializePage();

    const tokenData = getTokenData();
    if (tokenData) {
      fetchStudentData(tokenData.id);
      setStudent((prev: StudentState) => ({
        ...prev,
        role: tokenData.role,
      }));
    }
  }, []);

  const fetchStudentData = async (userId: number) => {
    try {
      const response = await authApi.getStudentLogin(userId);
      setStudent((prev: StudentState) => ({
        ...prev,
        ...response.data,
      }));
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
    }
  };

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

  useEffect(() => {
    // Panggil API untuk mengambil data berita
    fetchNewsInformation();
    fetchPaymentSppByStudentId();
    fetchViolationByStudentId();
  }, [fetchNewsInformation, fetchPaymentSppByStudentId, fetchViolationByStudentId]);

  useEffect(() => {
    // Jika data berita berhasil diambil, set ke state newsData
    if (newsInformation && newsInformation.length > 0) {
      setNews(newsInformation);
    }
  }, [newsInformation]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
          Beranda
        </h1>
        <p className="text-sm text-[var(--text-thin-color)]">
          Halo {student.name}, selamat datang kembali
        </p>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 hide-scrollbar pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rekap Nilai */}
          <div className="bg-white shadow rounded-lg p-6 col-span-2 w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                Rekap Nilai
              </h3>
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
                <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                  Keuangan
                </h3>
                <a href="/student/finance/payment-status" className="bg-[#1F509A] text-white text-xs px-3 py-1 rounded-full">
                  Lihat Detail
                </a>
              </div>
              <ul className="space-y-2">
                {paymentSpp && paymentSpp.filter(payment => payment.status === 'Belum Bayar').length > 0 ? (
                  paymentSpp
                    .filter(payment => payment.status === 'Belum Bayar')
                    .map((payment: PaymentSpp) => (
                      <li key={payment.id} className="text-sm flex items-center">
                        <div className="p-2 bg-orange-100 rounded-full mr-2 w-10 h-10 flex items-center justify-center">
                          <i
                            className="bx bx-money text-xl"
                            style={{ color: "#EC8306" }}
                          ></i>
                        </div>
                        <div>
                          <div>
                            Kamu belum membayar SPP bulan {payment.month}
                          </div>
                          <span className="text-gray-500">
                            {formatDate(payment.date)}
                          </span>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="text-sm flex items-center">
                    <div className="p-2 rounded-full bg-[#0a97b02a] mr-2 w-10 h-10 flex items-center justify-center">
                      <i className='bx bxs-check-circle text-2xl text-[var(--third-color)]'></i>
                    </div>
                    <div>
                      <div>Anda telah membayar SPP</div>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Total Point Pelanggaran */}
            <div className="bg-white shadow rounded-lg p-6 flex-grow">
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-start mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <div className="w-14 h-14 rounded-full bg-[#1F509A] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{totalPoints}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-left text-[var(--text-semi-bold-color)]">
                    Total Point Pelanggaran
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-left">
                  Tercatat ada {totalPoints} point pelanggaran yang kamu dapatkan. Jika
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
          style={{ marginTop: "20px" }}
          slidesPerView={1}
          slidesPerGroup={1}
          centeredSlides={true}
          loop={true}
          effect={"slide"}
          breakpoints={{
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              centeredSlides: false,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              centeredSlides: false,
              spaceBetween: 15,
            },
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              centeredSlides: true,
              spaceBetween: 10,
            },
          }}
        >
          {news.map((news, index) => (
            <SwiperSlide key={news.id}>
              <div
                className="bg-white shadow rounded-lg overflow-hidden w-full max-w-sm mx-auto flex flex-col"
                style={{ height: "350px" }}
              >
                <div className="relative h-48 md:h-56">
                  {news.photo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL
                        }/uploads/student-information/${news.photo
                          .split("/")
                          .pop()}`}
                      alt={news.activity}
                      className="rounded-t-lg object-cover"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "-"
                  )}
                </div>
                <div
                  className="p-4 flex flex-col flex-grow"
                  style={{ height: "100%" }}
                >
                  <div className="flex items-center justify-start pr-4">
                    <div className="flex flex-col items-start justify-start mr-4">
                      {news.date && (
                        <>
                          <span className="text-2xl font-bold text-[var(--main-color)]">
                            {new Date(news.date).getDate()}
                          </span>
                          <span className="text-xl font-semibold text-[var(--third-color)]">
                            {new Date(news.date).getMonth() + 1}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-grow text-left">
                      <h4 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                        {news.activity}
                      </h4>
                      <div
                        className="text-sm text-gray-600 mt-1 scroll-hidden"
                        style={{ maxHeight: "120px", overflowY: "auto" }}
                      >
                        {news.description}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Catatan: {news.note}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </div>
  );
}
