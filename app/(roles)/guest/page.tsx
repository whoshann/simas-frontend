"use client";
import "@/app/styles/globals.css";
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function GuestDashboard() {
    const carouselRef = useRef<HTMLDivElement>(null);

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
            image: "/images/Berita1.jpg",
            title: "Rapart Orang Tua",
            date: { day: "18", month: "01" },
            description: "Sosialisasi terkait pemberangkatan prakerin untuk orang tua siswa yang dilaksanakan di Home Teater jam 9 pagi tanggal 27 bulan Januari.",
            note: "Catatan: babababa."
        }
    ];

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

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
                <p className="text-sm text-gray-600">Halo, selamat datang di website kami</p>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* News Card */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden lg:col-span-2" ref={carouselRef}>
                        <div className="carousel rounded-box w-full">
                            {/* Carousel Item 1 */}
                            <div className="carousel-item w-full flex flex-col items-center">
                                <div className="p-4">
                                    <Image
                                        src={newsData[0].image}
                                        alt={newsData[0].title}
                                        width={800}
                                        height={400}
                                        className="rounded-box w-[320px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center flex justify-between items-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-[var(--main-color)]">{newsData[0].date.day}</span>
                                        <span className="text-4xl font-bold text-[var(--third-color)]">{newsData[0].date.month}</span>
                                    </div>
                                    <div className="text-left ml-4">
                                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                            {newsData[0].title}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {newsData[0].description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{newsData[0].note}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Carousel Item 2 */}
                            <div className="carousel-item w-full flex flex-col items-center">
                                <div className="p-4">
                                    <Image
                                        src={newsData[1].image}
                                        alt={newsData[1].title}
                                        width={800}
                                        height={400}
                                        className="rounded-box w-[320px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center flex justify-between items-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-[var(--main-color)]">{newsData[1].date.day}</span>
                                        <span className="text-4xl font-bold text-[var(--third-color)]">{newsData[1].date.month}</span>
                                    </div>
                                    <div className="text-left ml-4">
                                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                            {newsData[1].title}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {newsData[1].description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{newsData[1].note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card fitur akses */}
                    <div className="bg-[var(--main-color)] text-white shadow-md rounded-lg flex flex-col justify-between p-6">
                        <h3 className="text-3xl font-semibold mt-8 max-w-272px ml-6">Silahkan masuk atau login untuk mengakses keseluruhan fitur fitur</h3>
                    </div>
                </div>

                {/* Start 4 Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#1f509a2b] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--main-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-user-badge text-2xl' /> {/* Ikon untuk Guru */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Guru</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 200 guru yang mengajar</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#e88e1f29] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--second-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-graduation text-2xl' /> {/* Ikon untuk Siswa */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Siswa</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 1000 siswa</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#0a97b029] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--third-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-briefcase text-2xl' /> {/* Ikon untuk Karyawan */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Karyawan</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 100 karyawan</p>
                        </div>
                    </div>
                </div>
                {/* End 4 Card */}
            </main>
        </div>
    );
}