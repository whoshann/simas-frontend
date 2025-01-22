"use client";

import "@/app/styles/globals.css";
import { useState, useRef } from 'react';
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { Chart, registerables } from 'chart.js';
import Script from 'next/script';
import React from 'react';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { authApi } from "@/app/api/auth";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import TableData2 from "@/app/components/TableWithoutAction/TableData2";

interface User {
    id: number;
    name: string;
    username: string;
}

Chart.register(...registerables);

interface CircleProgressBarProps {
    percentage: number;
    label: string;
    color: string;
    backgroundColor: string;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({ percentage, label, color, backgroundColor }) => {
    const strokeWidth = 18;
    const radius = 50;
    const center = radius + strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg className="w-32 h-32">
                {/* Lingkaran untuk background (progress yang belum terisi) */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={backgroundColor} // Menggunakan backgroundColor untuk lingkaran belakang
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Lingkaran progress yang terisi */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1s ease-out',
                    }}
                />
                {/* Angka Persentase di Tengah Lingkaran */}
                <text
                    x="53%"
                    y="54%"
                    textAnchor="middle"
                    dy=".3em"
                    className="text-2xl font-semibold text-[var(--text-semi-bold-color)]" // Ukuran font diperbesar menjadi text-xl
                >
                    {percentage}
                </text>
            </svg>
            <p className="mt-5 text-sm font-semibold text-[var(--text-semi-bold-color)]">{label}</p>
        </div>
    );
};


export default function StudentAffairsDashboardPage() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedMonth, setSelectedMonth] = useState('Januari');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        username: '',
    });

    useEffect(() => {
        const initializePage = async () => {
            try {
                // Cek role dengan middleware
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                setIsAuthorized(true);

                // Fetch user data
                const userId = getUserIdFromToken();
                if (userId) {
                    await fetchUserData(Number(userId));
                }

            } catch (error) {
                console.error("Error initializing page:", error);
                setError("Terjadi kesalahan saat memuat halaman");
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    const fetchUserData = async (userId: number) => {
        try {
            const response = await authApi.getUserLogin(userId);
            setUser(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Gagal memuat data pengguna");
        }
    };

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Data dummy tabel prestasi
    const achievementData = [
        {
            id: 1,
            name: "Ilham Kurniawan",
            class: "X PH A",
            achievement: "Juara 1 Olimpiade sains",
            category: "Akademik",
            date: "21/01/2024"
        },
        {
            id: 2,
            name: "Adi Kurniawan",
            class: "X PH B",
            achievement: "Juara 1 FF",
            category: "Non Akademik",
            date: "22/01/2024"
        },
        {
            id: 3,
            name: "Imam Kurniawan",
            class: "XI IPA A",
            achievement: "Juara Satu ML",
            category: "Non Akademik",
            date: "23/01/2024"
        },
        {
            id: 4,
            name: "Amar Kurniawan",
            class: "XI IPA B",
            achievement: "Juara 1 Olimpiade IPA",
            category: "Akademik",
            date: "24/01/2024"
        },
        {
            id: 5,
            name: "Fawas Kurniawan",
            class: "XII IPS A",
            achievement: "Juara 1 Olimpiade MTK",
            category: "Akademik",
            date: "25/01/2024"
        }
    ];

    // Konfigurasi header tabel
    const tableHeaders = [
        { key: 'id', label: 'No' },
        { key: 'name', label: 'Nama' },
        { key: 'class', label: 'Kelas' },
        { key: 'achievement', label: 'Prestasi' },
        {
            key: 'category',
            label: 'Kategori',
            render: (value: string) => (
                <span className={`inline-block px-3 py-1 rounded-full ${value === 'Non Akademik'
                        ? 'bg-[#0a97b028] text-[var(--third-color)]'
                        : 'bg-[#e88e1f29] text-[var(--second-color)]'
                    }`}>
                    {value}
                </span>
            )
        },
        { key: 'date', label: 'Tanggal' }
    ];


    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">


            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>


                {/* Filtering Bulanan */}
                <div className="mt-4 sm:mt-0 w-full sm:w-72 ">
                    <div className="bg-white shadow-md rounded-lg py-4 px-7 flex items-center justify-center cursor-pointer" onClick={togglePanel}>
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-calendar text-[#1f509a] text-3xl'></i>
                        </div>
                        <div className="flex-1" >
                            <span className="text-lg font-semibold text-[var(--text-semi-bold-color)] ">Filter Bulan</span>
                            <p className="text-sm text-gray-600">{selectedMonth} {selectedYear}</p>
                        </div>
                        <svg className={`ml-7 h-4 w-4 transform transition-transform ${isPanelOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            {/* End Header */}



            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">



                {/* Start 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center  ">
                            <i className='bx bxs-check-circle text-[#1f509a] text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">20K</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Hadir</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-envelope text-[#e88d1f]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">987</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Izin</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-clinic text-[#0a97b0]  text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">600</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Sakit</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center ">
                            <i className='bx bxs-x-circle text-[#bd0000]  text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">430</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Alpha</p>
                        </div>
                    </div>
                </div>
                {/* End Cards */}


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">Kelas Dengan Alpha Terbanyak</h3>
                        </div>
                        <div className="flex justify-center">
                            <canvas ref={canvasRef} className="w-full h-60" />
                        </div>
                        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="lazyOnload" onLoad={() => {
                            const ctx = canvasRef.current?.getContext('2d');
                            console.log('Canvas context:', ctx);
                            if (ctx) {
                                new Chart(ctx, {
                                    type: 'bar',
                                    data: {
                                        labels: ['XI TG A', 'XI TG B', 'XI TG C', 'XI TG D', 'XI TG E'],
                                        datasets: [{
                                            label: 'Kelas',
                                            data: [80, 77, 97, 63, 100],
                                            backgroundColor: [
                                                '#1F509A',
                                                '#EC8306',
                                                '#0A8DA5',
                                                '#1F509A',
                                                '#EC8306'
                                            ],
                                            borderRadius: 5,
                                            barThickness: 15,
                                        }],
                                    },
                                    options: {
                                        responsive: true,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                            x: {
                                                type: 'category',
                                            },
                                        },
                                    },
                                });
                            } else {
                                console.error('Canvas context is null');
                            }
                        }} />
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)] ">Total Pelanggarn Siswa</h3>
                        </div>

                        <div className="flex flex-wrap justify-between gap-4 sm:flex-col md:flex-row mt-10">
                            <div className="flex-1">
                                <CircleProgressBar
                                    percentage={80}
                                    label="Ringan"
                                    color="#1f509a"
                                    backgroundColor="#1f509a2b" // Warna background progress yang belum terisi
                                />
                            </div>
                            <div className="flex-1">
                                <CircleProgressBar
                                    percentage={40}
                                    label="Sedang"
                                    color="#e88d1f"
                                    backgroundColor="#e88e1f29" // Warna background progress yang belum terisi
                                />
                            </div>
                            <div className="flex-1">
                                <CircleProgressBar
                                    percentage={20}
                                    label="Berat"
                                    color="#0a97b0"
                                    backgroundColor="#0a97b029" // Warna background progress yang belum terisi
                                />
                            </div>
                        </div>

                    </div>
                </div>



                {/* Table Section */}
                <div>
                    <div className="mb-4">
                        <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]">
                            Daftar Siswa Berprestasi
                        </span>
                    </div>

                    <TableData2
                        headers={tableHeaders}
                        data={achievementData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />
                </div>
            </main>
        </div>
    );
}