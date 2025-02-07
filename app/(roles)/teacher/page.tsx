"use client";

import "@/app/styles/globals.css";
import { useEffect, useState, useRef } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from "next/image";
import { getUserIdFromToken } from '@/app/utils/tokenHelper';
import Calendar from "react-calendar";
import { authApi } from '@/app/api/auth';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { NewsInformation } from "@/app/api/news-information/types";
import { useNewsInformation } from "@/app/hooks/useNewsInformation";

export default function TeacherDashboardPage() {
  const [date, setDate] = useState(new Date());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [teacher, setTeacher] = useState<any>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const { newsInformation, fetchNewsInformation } = useNewsInformation();
  const [news, setNews] = useState<NewsInformation[]>([]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Teacher"]);
        setIsAuthorized(true);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const next = carouselRef.current.querySelector('.carousel-item:nth-child(2)');
        if (next) {
          next.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 5000); // Ganti 3000 dengan waktu dalam milidetik sesuai kebutuhan

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Panggil API untuk mengambil data berita
    fetchNewsInformation();
  }, [fetchNewsInformation]);

  useEffect(() => {
    // Jika data berita berhasil diambil, set ke state newsData
    if (newsInformation && newsInformation.length > 0) {
      setNews(newsInformation);
    }
  }, [newsInformation]);

  // Tambahkan data agenda sebagai konstanta
  const agenda = [
    {
      date: new Date(2025, 0, 24),
      subject: "English",
      chapters: "10 of 20 chapters",
      time: "12.30 - 14.30",
    },
    {
      date: new Date(2025, 0, 25),
      subject: "Mathematics",
      chapters: "5 of 15 chapters",
      time: "10.00 - 12.00",
      description: "Pembelajaran tentang aljabar dan geometri.",
    },
    {
      date: new Date(2025, 0, 28),
      subject: "Sosialisasi Pra PKL Siswa",
      chapters: "",
      time: "10.00 - 12.00",
      description: "Sosialisasi untuk siswa terkait persiapan dan pelaksanaan PKL yang akan dilaksanakan di ruang kelas jam 10 pagi tanggal 28 bulan Januari.",
    },
    // Tambahkan agenda lainnya di sini
  ];

  // Fungsi untuk memeriksa apakah ada agenda pada tanggal tertentu
  const hasAgenda = (date: Date) => {
    return agenda.some((item) => item.date.toDateString() === date.toDateString());
  };

  // Fungsi untuk mendapatkan agenda pada tanggal tertentu
  const getAgendaForDate = (date: Date) => {
    return agenda.filter(
      (item) => item.date.toDateString() === date.toDateString()
    );
  };

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
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
        <p className="text-sm text-gray-600">Halo {teacher.name}, selamat datang kembali</p>
      </header>

      <main className="px-9 pb-6">
        {/* Banner */}
        <div className="bg-[var(--main-color)] text-white rounded-lg p-6 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Semoga Hari Anda Penuh Kebahagiaan Dan Keberhasilan Dalam Mengajar!
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-white shadow-md rounded-lg overflow-hidden lg:col-span-2" ref={carouselRef}>
              <div className="carousel rounded-box w-full">
                {news.map((news) => (
                  <div key={news.id} className="carousel-item w-full flex flex-col items-center">
                    <div className="p-4">
                      {news.photo ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/student-information/${news.photo.split('/').pop()}`}
                          alt={news.activity}
                          width={800}
                          height={400}
                          className="rounded-box w-[320px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                        />
                      ) : (
                        '-'
                      )}
                    </div>
                    <div className="p-6 text-center flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        {news.date && (
                          <>
                            <span className="text-4xl font-bold text-[var(--main-color)]"> {new Date(news.date).getDate()}</span>
                            <span className="text-4xl font-bold text-[var(--third-color)]">{new Date(news.date).getMonth() + 1}</span>
                          </>
                        )}
                      </div>
                      <div className="text-left ml-4">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                          {news.activity}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                          {news.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Catatan: {news.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar and Agenda Wrapper */}
          <div className="lg:col-span-1 flex flex-col">
            {/* Calendar */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 w-full">
              <h3 className="text-lg text-[var(--text-semi-bold-color)] font-semibold mb-4">Kalender</h3>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setDate(value);
                  }
                }}
                value={date}
                className="custom-calendar"
                tileClassName={({ date, view }) => {
                  if (view === "month" && date.getDay() === 0) {
                    return "text-red-500";
                  }
                  return "hover:bg-[var(--main-color)] hover:text-white";
                }}
                tileContent={({ date, view }) => {
                  if (view === "month" && hasAgenda(date)) {
                    return (
                      <div className="flex justify-center">
                        <div className="bg-[var(--main-color)] w-2 h-2 rounded-full mt-8"></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </div>

            {/* Agenda */}
            <div className="bg-white shadow rounded-lg p-6 w-full">
              <h3 className="text-lg text-[var(--text-semi-bold-color)] font-semibold mb-4">Agenda</h3>
              {getAgendaForDate(date).map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center"
                >
                  {/* Angka */}
                  <div className="flex-shrink-0 mr-4 text-center">
                    <span className="text-3xl font-bold text-[var(--main-color)]">{item.date.getDate()}</span>
                  </div>
                  {/* Deskripsi */}
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-semi-bold-color)]">{item.subject}</h4>
                    <p className="text-sm text-gray-600">{item.chapters}</p>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}