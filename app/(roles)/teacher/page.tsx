"use client";

import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from "next/image";
import Calendar from "react-calendar";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";

export default function TeacherDashboardPage() {
  const [date, setDate] = useState(new Date());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
        try {
            await roleMiddleware(["Teacher","SuperAdmin"]);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Tambahkan data agenda
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
        <p className="text-sm text-gray-600">
          Halo James, selamat datang kembali
        </p>
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
            <div className="bg-white shadow rounded-lg overflow-hidden flex-1">
              <div className="p-4">
                <Image
                  src="/images/Berita1.jpg"
                  alt="Sosialisasi Prakerin Orang Tua"
                  width={500}
                  height={400}
                  className="w-full h-[360px] object-cover rounded-lg"
                />
              </div>


              <div className="p-4 flex">
                <div className="flex flex-col items-center justify-center pr-8 pl-4">
                  <span className="text-3xl font-bold text-[var(--main-color)]">8</span>
                  <span className="text-3xl font-semibold text-[var(--third-color)]">
                    {new Date().toLocaleString("default", { month: "short" })}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl text-[var(--text-semi-bold-color)] font-semibold">
                    Sosialisasi Prakerin Orang Tua
                  </h4>
                  <p className="text-md text-[var(--text-thin-color)]">
                    Sosialisasi terkait pemberangkatan prakerin untuk orang tua
                    siswa yang dilaksanakan di Home Theater jam 9 pagi tanggal
                    8 bulan Januari.
                  </p>
                </div>
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
