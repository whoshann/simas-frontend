"use client";

import "@/app/styles/globals.css";
import { useState, useRef } from 'react';
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { Chart, registerables } from 'chart.js';
import Script from 'next/script';
import React from 'react';
import Cookies from "js-cookie";
import axios from "axios";

Chart.register(...registerables);

interface CircleProgressBarProps {
    percentage: number;
    label: string;
    color: string;
    backgroundColor: string; // Menambahkan backgroundColor
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({ percentage, label, color, backgroundColor }) => {
    const strokeWidth = 18; // Mempertebal garis menjadi 20
    const radius = 50; // Sesuaikan dengan strokeWidth
    const center = radius + strokeWidth; // Pusat lingkaran
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
    // Panggil middleware dan hooks di awal komponen
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'Student' dan 'SuperAdmin'
        roleMiddleware(["StudentAffairs", "SuperAdmin"]);
        fetchData();
    }, []);

    const token = Cookies.get("token");
    const [user, setUser] = useState<any>({});
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedMonth, setSelectedMonth] = useState('Januari');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Data statis tabel absensi
    const data = [
        { no: 1, name: "Ilham Kurniawan", class: "X PH A", achivement: "Juara 1 Oimpiade sains", category: "Akademik", date: "21/01/2024" },
        { no: 2, name: "Adi Kurniawan", class: "X PH B", achivement: "Juara 1 FF", category: "Non Akademik", date: "22/01/2024" },
        { no: 3, name: "Imam Kurniawan", class: "XI IPA A", achivement: "Juara Satu ML", category: "Non Akademik", date: "23/01/2024" },
        { no: 4, name: "Amar Kurniawan", class: "XI IPA B", achivement: "Juara 1 Olimpiade Ipas", category: "Akademik", date: "24/01/2024" },
        { no: 5, name: "Fawas Kurniawan", class: "XII IPS A", achivement: "Juara 1 Olimpiade MTK", category: "Akademik", date: "25/01/2024" },
        { no: 6, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 7, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 8, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 9, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 10, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 11, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 12, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 13, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 14, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 15, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 16, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 17, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 18, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 19, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },
        { no: 20, name: "Ilham Kurniawan", class: "XII IPS A", achivement: "Hadir", category: "Akademik", date: "25/01/2024" },

    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.achivement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

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

                    {/* Card 2 (Sakit + Alpha) */}
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


                {/* Card for Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">


                    <div className="mb-4 flex justify-between ">

                        {/* Start Showing entries */}
                        <div className="">
                            <span className="text-md sm:text-lg font-semibold text-[var(--text-semi-bold-color)]"> Daftar Siswa Berprestasi</span>
                        </div>
                        {/* End Showing entries */}


                        {/*Start Search */}
                        <div className="border border-gray-300 rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-24 sm:w-56" >
                            <i className='bx bx-search text-[var(--text-semi-bold-color)] text-xs sm:text-lg mr-2'></i>
                            <input
                                type="text"
                                placeholder="Cari data..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 focus:outline-none text-xs sm:text-base w-16 sm:w-40"
                            />
                        </div>
                        {/*End Search */}
                    </div>


                    {/* Start Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Prestasi</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.class}</td>
                                        <td className="py-2 px-4 border-b">{item.achivement}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${item.category === 'Non Akademik' ? 'bg-[#0a97b028] text-[var(--third-color)]' : item.category === 'Akademik' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : ''}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* End Table */}



                    {/*Start Pagination and showing entries */}
                    <div className="flex justify-between items-center mt-5">
                        <span className="text-xs sm:text-base" >Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

                        {/* Pagination */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            {/* Pagination Numbers */}
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                                    const pageNumber = currentPage + index;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={` rounded-md px-3 py-1 ${currentPage === pageNumber ? ' bg-[var(--main-color)] text-white ' : 'text-[var(--main-color)]'}`}>
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                    {/*End Pagination and showing entries */}


                </div>
            </main>
        </div>
    );
}