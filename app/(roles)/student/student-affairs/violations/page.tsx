"use client";
import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

interface CustomJwtPayload {
    sub: number;
}

interface ViolationPoint {
    id: number;
    name: string;
    points: number;
}

interface ViolationData {
    id: number;
    name: string;
    date: string;
    punishment: string;
    violationPoint: ViolationPoint;
}

interface ViolationResponse {
    studentId: number;
    totalPoints: number;
    violations: ViolationData[];
}

export default function StudentViolationPage() {
    const [studentId, setStudentId] = useState<number | null>(null);
    const [violations, setViolations] = useState<ViolationData[]>([]);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    // State untuk fitur tabel
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const tableHeaders = [
        { key: 'name', label: 'Jenis Pelanggaran' },
        { key: 'violationPoint', label: 'Kategori' },
        { key: 'points', label: 'Poin' },
        { key: 'punishment', label: 'Sanksi' },
        {
            key: 'date',
            label: 'Tanggal',
            render: (value: string) => new Date(value).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        },
    ];

    const fetchViolations = async (studentId: number) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/violations/student/${studentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                console.log("✅ Data pelanggaran berhasil diambil:", response.data.data);
                const violationData: ViolationResponse = response.data.data;
                setViolations(violationData.violations);
                setTotalPoints(violationData.totalPoints);
            }
        } catch (error) {
            console.error('❌ Error fetching violations:', error);
            if (axios.isAxiosError(error)) {
                console.error('Detail error:', {
                    status: error.response?.status,
                    message: error.response?.data?.message,
                    url: error.config?.url
                });
            }
            toast.error('Gagal mengambil data pelanggaran');
        }
    };

    // fungsi kategori style
    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'Ringan':
                return 'bg-[#0a97b028] text-[var(--third-color)]';
            case 'Sedang':
                return 'bg-[#e88e1f29] text-[var(--second-color)]';
            case 'Berat':
                return 'bg-[#bd000025] text-[var(--fourth-color)]';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student", "SuperAdmin"]);
                setIsAuthorized(true);

                const token = Cookies.get("token");
                if (token) {
                    const decodedToken = jwtDecode<CustomJwtPayload>(token);
                    const studentId = decodedToken.sub;
                    setStudentId(studentId);
                    await fetchViolations(studentId);
                }
            } catch (error) {
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    // Monitor perubahan data
    useEffect(() => {
    }, [violations, searchTerm, currentPage, entriesPerPage]);

    // Filter dan pagination logic
    const filteredData = violations.filter((violation) =>
        Object.values(violation).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        String(violation.violationPoint.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(violation.violationPoint.points).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(
        startIndex,
        startIndex + entriesPerPage
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!isAuthorized) return null;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            {/* Start Header */}
            <header className="pt-6 pb-0 px-9 flex flex-col sm:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Point Pelanggaran</h1>
                    <p className="text-sm text-gray-600">Halo James, selamat datang kembali</p>
                </div>
            </header>
            {/* End Header */}

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 mt-6">


                {/* Start 3 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Kolom Kedua: Card 1, Card 2, dan Card 3 */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Card 1 */}
                            <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                                <div className="bg-[#1f509a27] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                    <i className='bx bxs-check-circle text-[#1f509a] text-4xl'></i>
                                </div>
                                <div>
                                    <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Ringan</p>
                                    <p className="text-sm text-[var(--text-regular-color)]">5 Point</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                                <div className="bg-[#e88e1f29] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                    <i className='bx bxs-error-circle text-[#e88d1f] text-4xl'></i>
                                </div>
                                <div>
                                    <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Sedang</p>
                                    <p className="text-sm text-[var(--text-regular-color)]">20 Point</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white shadow-md rounded-lg px-2 py-7 flex items-center justify-center">
                            <div className="bg-[#bd000025] rounded-full p-3 mr-4 w-12 h-12 flex items-center justify-center">
                                <i className='bx bxs-x-circle text-[#bd0000] text-4xl'></i>
                            </div>
                            <div>
                                <p className="text-2xl text-[var(--text-semi-bold-color)] font-bold">Berat</p>
                                <p className="text-sm text-[var(--text-regular-color)]">50 Point</p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Pertama: Card Besar */}
                    <div className="bg-[var(--main-color)] shadow-md rounded-lg col-span-1 flex items-center justify-center h-64">
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="bg-[#ffffff38] rounded-full p-3 mb-2 mr-0 sm:mr-5 w-20 h-20 flex items-center justify-center">
                                <div className="rounded-full bg-white w-12 h-12 flex items-center justify-center">
                                    <span className="text-xl font-bold text-[#1f509a]">{totalPoints}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl text-white font-bold">Total Point Anda</p>
                                <p className="text-sm text-white">{totalPoints} / 100 ( Surat Peringatan 1 )</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Cards */}

                {/* Card table */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    {/* Table Actions */}
                    <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
                        <div className="text-xs sm:text-base">
                            <label className="mr-2">Tampilkan</label>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <label className="ml-2">Entri</label>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            />
                            <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    {tableHeaders.map((header) => (
                                        <th
                                            key={header.key}
                                            className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b"
                                        >
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((violation, index) => (
                                    <tr key={violation.id || index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 border-b">{violation.name}</td>
                                        <td className="px-4 py-3 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${getCategoryStyle(violation.violationPoint.name)}`}>
                                                {violation.violationPoint.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b">{violation.violationPoint.points}</td>
                                        <td className="px-4 py-3 border-b">{violation.punishment}</td>
                                        <td className="px-4 py-3 border-b">
                                            {new Date(violation.date).toLocaleDateString('id-ID', {
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
                        <span className="text-xs sm:text-sm">
                            Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
                        </span>

                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`rounded-md px-3 py-1 ${currentPage === page
                                            ? 'bg-[var(--main-color)] text-white'
                                            : 'text-[var(--main-color)]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
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
                </div>
            </main>
        </div>
    );
}