"use client";

import "@/app/styles/globals.css";
import { useEffect, useState, useRef } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from "next/image";
import Calendar from "react-calendar";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";

export default function TeacherDashboardPage() {
  const [date, setDate] = useState(new Date());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Teacher", "SuperAdmin"]);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Tambahkan data berita sebagai konstanta
  const newsData = [
    {
      id: 1,
      image: "/images/Berita1.jpg",
      title: "Sosialisasi Prakerin Orang Tua",
      date: { day: "27", month: "01" },
      description: "Sosialisasi terkait pemberangkatan prakerin untuk orang tua siswa yang dilaksanakan di Home Teater jam 9 pagi tanggal 27 bulan Januari.",
      note: "Catatan: babababa."
    },
    {
      id: 2,
      image: "/images/Berita2.jpg",
      title: "Rapart Orang Tua",
      date: { day: "18", month: "01" },
      description: "Sosialisasi terkait pemberangkatan prakerin untuk orang tua siswa yang dilaksanakan di Home Teater jam 9 pagi tanggal 27 bulan Januari.",
      note: "Catatan: babababa."
    }
  ];

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
        <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
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
                {newsData.map((news) => (
                  <div key={news.id} className="carousel-item w-full flex flex-col items-center">
                    <div className="p-4">
                      <Image
                        src={news.image}
                        alt={news.title}
                        width={800}
                        height={400}
                        className="rounded-box w-[320px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                      />
                    </div>
                    <div className="p-6 text-center flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-[var(--main-color)]">{news.date.day}</span>
                        <span className="text-4xl font-bold text-[var(--third-color)]">{news.date.month}</span>
                      </div>
                      <div className="text-left ml-4">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                          {news.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                          {news.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{news.note}</p>
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