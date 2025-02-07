"use client";

import "@/app/styles/globals.css";
import { useState, useEffect, useMemo } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useAbsence } from "@/app/hooks/useAbsence";
import { useViolation } from "@/app/hooks/useViolationData";
import { useAchievements } from "@/app/hooks/useAchievement";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { authApi } from "@/app/api/auth";
import Image from "next/image";
import { ChartOptions } from 'chart.js';
import { useUser } from "@/app/hooks/useUser";

// Registrasi Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CircleProgressBarProps {
    count: number;
    label: string;
    color: string;
    backgroundColor: string;
}

interface User {
    id: number;
    name: string;
    username: string;
}

// Komponen StatCard
const StatCard = ({
    title,
    count,
    icon,
    color,
    textColor
}: {
    title: string;
    count: number;
    icon: string;
    color: string;
    textColor: string;
}) => {
    return (
        <div className={`p-6 rounded-lg ${color}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${textColor}`}>{count}</h3>
                </div>
                <i className={`bx ${icon} text-3xl ${textColor}`}></i>
            </div>
        </div>
    );
};

// Komponen CircleProgressBar
const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
    count,
    label,
    color,
    backgroundColor
}) => {
    const strokeWidth = 18;
    const radius = 50;
    const center = radius + strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const maxValue = 100; // Nilai maksimum tetap
    const percentage = Math.min((count / maxValue) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg className="w-32 h-32">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
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
                <text
                    x="53%"
                    y="54%"
                    textAnchor="middle"
                    dy=".3em"
                    className="text-2xl font-semibold text-[var(--text-semi-bold-color)]"
                >
                    {count}
                </text>
            </svg>
            <p className="mt-5 text-sm font-semibold text-[var(--text-semi-bold-color)]">{label}</p>
        </div>
    );
};

// Komponen ClassAlphaChart
const ClassAlphaChart = ({ data }: { data: { className: string; count: number }[] }) => {
    const chartData = {
        labels: data.map(item => item.className),
        datasets: [{
            label: 'Jumlah Alpha',
            data: data.map(item => item.count),
            backgroundColor: [
                '#1F509A',
                '#EC8306',
                '#0A8DA5',
                '#1F509A',
                '#EC8306'
            ],
            borderRadius: 5,
            barThickness: 15,
        }]
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'linear',
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value.toString();
                        }
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Jumlah Alpha: ${Math.round(context.raw as number)}`;
                    }
                }
            },
            legend: {
                display: false
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

// Komponen ViolationStats
const ViolationStats = ({ stats }: { stats: { light: number; medium: number; heavy: number } }) => {
    return (
        <>
            <div className="flex-1">
                <CircleProgressBar
                    count={stats.light}
                    label="Pelanggaran Ringan"
                    color="#1f509a"
                    backgroundColor="#1f509a2b"
                />
            </div>
            <div className="flex-1">
                <CircleProgressBar
                    count={stats.medium}
                    label="Pelanggaran Sedang"
                    color="#e88d1f"
                    backgroundColor="#e88e1f29"
                />
            </div>
            <div className="flex-1">
                <CircleProgressBar
                    count={stats.heavy}
                    label="Pelanggaran Berat"
                    color="#bd0000"
                    backgroundColor="#bd000025"
                />
            </div>
        </>
    );
};

export default function StudentAffairsDashboardPage() {
    // States
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(5);
    const [userId, setUserId] = useState<User>({ id: 0, name: '', username: '' });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
    const { user } = useUser();

    // Hooks untuk data
    const { absence, loading: absenceLoading, error: absenceError, fetchAbsence } = useAbsence();
    const { violations, loading: violationLoading, error: violationError, fetchViolations } = useViolation();
    const { achievements, loading: achievementLoading, error: achievementError, fetchAchievements } = useAchievements();

    console.log('Loading States:', { absenceLoading, violationLoading, achievementLoading });
    console.log('Errors:', { absenceError, violationError, achievementError });
    console.log('Data:', { absence, violations, achievements });

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleMonthSelect = (monthIndex: number) => {
        setSelectedMonth(monthIndex + 1);
        setIsPanelOpen(false);
    };

    // Fungsi untuk mendapatkan nama bulan
    const getMonthName = (monthNumber: number) => {
        return months[monthNumber - 1];
    };

    // Inisialisasi halaman
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                setIsAuthorized(true);

                const userId = getUserIdFromToken();
                if (userId) {
                    await fetchUserData(Number(userId));
                }

            } catch (error) {
                console.error("Error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAbsence(),
                    fetchViolations(),
                    fetchAchievements()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Fetch user data
    const fetchUserData = async (userId: number) => {
        try {
            const response = await authApi.getUserLogin(userId);
            setUserId(response.data);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    // Filter function
    const filterDataByMonth = (date: string) => {
        if (!date) return false;
        if (selectedMonth === null) return true; // Jika 'Semua' dipilih, tampilkan semua data

        const itemDate = new Date(date);
        return itemDate.getMonth() + 1 === selectedMonth &&
            itemDate.getFullYear() === selectedYear;
    };

    // Fungsi untuk mendapatkan teks yang ditampilkan
    const getDisplayText = () => {
        if (selectedMonth === null) {
            return `Semua Bulan ${selectedYear}`;
        }
        return `${getMonthName(selectedMonth)} ${selectedYear}`;
    };

    // Memproses data absensi
    const absenceStats = useMemo(() => {
        const filteredAbsence = absence.filter(item => filterDataByMonth(item.date));
        return {
            present: filteredAbsence.filter(item => item.status === 'Present').length,
            sick: filteredAbsence.filter(item => item.status === 'Sick').length,
            alpha: filteredAbsence.filter(item => item.status === 'Alpha').length,
            permission: filteredAbsence.filter(item => item.status === 'Permission').length
        };
    }, [absence, selectedMonth, selectedYear]);

    // Memproses data alpha per kelas
    const classAlphaStats = useMemo(() => {
        const filteredAbsence = absence.filter(item =>
            filterDataByMonth(item.date) && item.status === 'Alpha'
        );

        const alphaByClass = filteredAbsence.reduce((acc, item) => {
            const className = item.Student?.class?.name || 'Unknown';
            acc[className] = (acc[className] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(alphaByClass)
            .map(([className, count]) => ({ className, count }))
            .sort((a, b) => b.count - a.count);
    }, [absence, selectedMonth, selectedYear]);

    // Memproses data pelanggaran
    const violationStats = useMemo(() => {
        const filteredViolations = violations.filter(item => filterDataByMonth(item.date));
        return {
            light: filteredViolations.filter(item => item.violationPoint.name === 'Ringan').length,
            medium: filteredViolations.filter(item => item.violationPoint.name === 'Sedang').length,
            heavy: filteredViolations.filter(item => item.violationPoint.name === 'Berat').length
        };
    }, [violations, selectedMonth, selectedYear]);

    // Filter dan pagination untuk data prestasi
    const filteredAchievements = useMemo(() => {
        return achievements
            .filter(item => filterDataByMonth(item.achievementDate))
            .filter(item =>
                item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.achievementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.competitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.typeOfAchievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.achievementDate.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [achievements, selectedMonth, selectedYear, searchTerm]);

    // Pagination calculations
    const totalEntries = filteredAchievements.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredAchievements.slice(startIndex, startIndex + entriesPerPage);

    // Handle image click
    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    // Handle close image
    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    // Loading state
    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            if (absenceLoading || violationLoading || achievementLoading) {
                console.error("Loading timeout reached");
            }
        }, 10000); // 10 detik timeout

        return () => clearTimeout(loadingTimeout);
    }, [absenceLoading, violationLoading, achievementLoading]);

    if (absenceLoading || violationLoading || achievementLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            {/* Header dan Filter Bulan */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row justify-between items-start">
                <div className="self-start"> 
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
                    <p className="text-sm text[var(--text-regular-color)] mt-1">Halo {user?.username}, selamat datang kembali</p>
                </div>

                {/* Filtering Bulanan */}
                <div className="mt-4 sm:mt-0 w-full sm:w-72 relative">
                    <div
                        className="bg-white shadow-md rounded-lg py-4 px-7 flex items-center justify-center cursor-pointer"
                        onClick={togglePanel}
                    >
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-calendar text-[#1f509a] text-3xl'></i>
                        </div>
                        <div className="flex-1">
                            <span className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                Filter Bulan
                            </span>
                            <p className="text-sm text[var(--text-regular-color)]">
                                {getDisplayText()}
                            </p>
                        </div>
                        <svg
                            className={`ml-7 h-4 w-4 transform transition-transform ${isPanelOpen ? 'rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>

                    {/* Dropdown Panel */}
                    {isPanelOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10">
                            <div className="p-2">
                                {/* Tahun Selector */}
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="w-full mb-2 p-2 border rounded"
                                >
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
                                        .map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))
                                    }
                                </select>

                                {/* Opsi Semua Bulan */}
                                <div
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded ${selectedMonth === null ? 'bg-[#1f509a27] text-[#1f509a]' : ''
                                        }`}
                                    onClick={() => {
                                        setSelectedMonth(null);
                                        setIsPanelOpen(false);
                                    }}
                                >
                                    Semua Data
                                </div>

                                {/* Divider */}
                                <div className="my-2 border-t border-gray-200"></div>

                                {/* Bulan List */}
                                <div className="max-h-60 overflow-y-auto">
                                    {months.map((month, index) => (
                                        <div
                                            key={month}
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded ${selectedMonth === index + 1 ? 'bg-[#1f509a27] text-[#1f509a]' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedMonth(index + 1);
                                                setIsPanelOpen(false);
                                            }}
                                        >
                                            {month}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">

                {/* Cards Absensi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-check-circle text-[#1f509a] text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.present}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Hadir</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-envelope text-[#e88d1f] text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.permission}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Izin</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#0a97b02a] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-clinic text-[#0a97b0] text-3xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.sick}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Sakit</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg px-4 py-7 flex items-center justify-center">
                        <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                            <i className='bx bxs-x-circle text-[#bd0000] text-4xl'></i>
                        </div>
                        <div>
                            <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">{absenceStats.alpha}</p>
                            <p className="text-sm text-[var(--text-regular-color)]">Alpha</p>
                        </div>
                    </div>
                </div>

                {/* Chart Kelas Alpha dan Statistik Pelanggaran dalam satu baris */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Card Kelas Alpha */}
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                Kelas dengan Alpha Terbanyak
                            </h3>
                        </div>
                        <div className="flex justify-center">
                            <div className="h-[300px] w-full">
                                <ClassAlphaChart data={classAlphaStats} />
                            </div>
                        </div>
                    </div>

                    {/* Card Pelanggaran */}
                    <div className="bg-white shadow-md rounded-lg px-7 py-7 col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                Total Pelanggaran Siswa
                            </h3>
                        </div>
                        <div className="flex flex-wrap justify-between gap-4 sm:flex-col md:flex-row mt-10">
                            <ViolationStats stats={violationStats} />
                        </div>
                    </div>
                </div>


                {/* Tabel Prestasi */}
                <div className="bg-white rounded-lg shadow-md my-6">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
                                Data Prestasi
                            </h2>
                            <div className="border border-gray-300 rounded-lg py-2 px-4 flex items-center w-64">
                                <i className='bx bx-search text-gray-400 mr-2'></i>
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Tabel */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="text-[var(--text-semi-bold-color)]">
                                        <th className="px-4 py-2 border-b">No</th>
                                        <th className="px-4 py-2 border-b">Nama Siswa</th>
                                        <th className="px-4 py-2 border-b">Kelas</th>
                                        <th className="px-4 py-2 border-b">Nama Prestasi</th>
                                        <th className="px-4 py-2 border-b">Nama Lomba</th>
                                        <th className="px-4 py-2 border-b">Jenis Prestasi</th>
                                        <th className="px-4 py-2 border-b">Bukti</th>
                                        <th className="px-4 py-2 border-b">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b text-center">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {item.student?.name}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {item.class?.name}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {item.achievementName}
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {item.competitionName}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <span className={`inline-block px-3 py-1 rounded-full ${item.typeOfAchievement === 'Non_Academic'
                                                    ? 'bg-[#0a97b028] text-[var(--third-color)]'
                                                    : 'bg-[#e88e1f29] text-[var(--second-color)]'
                                                    }`}>
                                                    {item.typeOfAchievement === 'Non_Academic' ? 'Non_Akademik' : item.typeOfAchievement === 'academic' ? 'Akademik' : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                <div className="w-16 h-16 overflow-hidden rounded">
                                                    {item.photo ? (
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => handleImageClick(
                                                                `${process.env.NEXT_PUBLIC_API_URL}/uploads/achievement/${item.photo?.split('/').pop()}`
                                                            )}
                                                        >
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/achievement/${item.photo.split('/').pop()}`}
                                                                alt="Bukti Prestasi"
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-b">
                                                {new Date(item.achievementDate).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-5">
                            <span className="text-xs sm:text-base">
                                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-[var(--main-color)]"
                                >
                                    &lt;
                                </button>
                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`rounded-md px-3 py-1  ${currentPage === page
                                                ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-[var(--main-color)]"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseImage}
                >
                    <div className="relative bg-white rounded-lg p-2 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={handleCloseImage}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <i className='bx bx-x text-2xl'></i>
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Preview"
                            width={800}
                            height={600}
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}