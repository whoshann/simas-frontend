"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import ClaimModal from '@/app/components/insurance-modal/ClaimModal';
import { ClaimData, StatusInsurance } from '@/app/api/insurance-modal/types';
import Cookies from "js-cookie";
import axios from "axios";

export default function StudentAffairsClaimInsurancePage() {
    useEffect(() => {
        roleMiddleware(["StudentAffairs", "SuperAdmin"]);
        fetchData();
    }, []);

    const [user, setUser] = useState<any>({});
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const token = Cookies.get("token");
    const [statusInsurance, setStatusInsurance] = useState<StatusInsurance>("Pending");
    const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Data dummy
    const claims: ClaimData[] = [
        {
            id: 1,
            name: "Ilham",
            date: "20/01/2024",
            statusInsurance: "Pending",
            class: "XII IPA 1",
            nis: "1234567890",
            insuranceType: "Kesehatan",
            incidentDate: "15/01/2024",
            fatherName: "Budi Santoso",
            motherName: "Sri Wahyuni",
            reason: "Kecelakaan saat praktikum di laboratorium",
            supportingImage: "/images/Berita1.jpg"
        },
        {
            id: 2,
            name: "Imron",
            date: "20/01/2024",
            statusInsurance: "Disetujui",
            class: "XII IPA 2",
            nis: "1234567891",
            insuranceType: "Kesehatan",
            incidentDate: "16/01/2024",
            fatherName: "Ahmad Suharto",
            motherName: "Siti Aminah",
            reason: "Cedera saat olahraga",
            supportingImage: "/images/Berita1.jpg"
        },
        {
            id: 3,
            name: "Rina",
            date: "20/01/2024",
            statusInsurance: "Ditolak",
            class: "XII IPS 1",
            nis: "1234567892",
            insuranceType: "Kesehatan",
            incidentDate: "17/01/2024",
            fatherName: "Joko Widodo",
            motherName: "Iriana",
            reason: "Sakit demam berdarah",
            supportingImage: "/images/Berita1.jpg"
        },
        {
            id: 4,
            name: "Rina",
            date: "21/02/2026",
            statusInsurance: "Pending",
            class: "XII IPS 1",
            nis: "1234567892",
            insuranceType: "Kesehatan",
            incidentDate: "17/01/2024",
            fatherName: "Joko Widodo",
            motherName: "Iriana",
            reason: "Sakit demam berdarah",
            supportingImage: "/images/Berita1.jpg"
        },
        {
            id: 5,
            name: "Bambang",
            date: "20/01/2024",
            statusInsurance: "Disetujui",
            class: "XII IPS 1",
            nis: "1234567892",
            insuranceType: "Kesehatan",
            incidentDate: "17/01/2024",
            fatherName: "Joko Widodo",
            motherName: "Iriana",
            reason: "Sakit demam berdarah",
            supportingImage: "/images/Berita1.jpg"
        },
        {
            id: 6,
            name: "Tateng",
            date: "20/01/2024",
            statusInsurance: "Ditolak",
            class: "XII IPS 1",
            nis: "1234567892",
            insuranceType: "Kesehatan",
            incidentDate: "17/01/2024",
            fatherName: "Joko Widodo",
            motherName: "Iriana",
            reason: "Sakit demam berdarah",
            supportingImage: "/images/Berita1.jpg"
        },
    ];

    const handleCardClick = (claim: ClaimData) => {
        setSelectedClaim(claim);
        setIsModalOpen(true);
    };

    const handleConfirm = async (claimId: number) => {
        try {
            // Implementasi logika konfirmasi dengan API
            console.log("Klaim dikonfirmasi:", claimId);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saat mengkonfirmasi klaim:", error);
        }
    };

    const handleReject = async (claimId: number) => {
        try {
            // Implementasi logika penolakan dengan API
            console.log("Klaim ditolak:", claimId);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saat menolak klaim:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClaim(null);
    };

    const getStatusStyle = (statusInsurance: StatusInsurance) => {
        switch (statusInsurance) {
            case "Pending":
                return { textColor: "text-[var(--second-color)]", bgColor: "bg-[#e88e1f29]" };
            case "Disetujui":
                return { textColor: "text-[var(--third-color)]", bgColor: "bg-[#0a97b028]" };
            case "Ditolak":
                return { textColor: "text-[var(--fourth-color)]", bgColor: "bg-[#bd00002a]" };
            default:
                return { textColor: "text-gray-600", bgColor: "bg-gray-100" };
        }
    };

    const fetchData = async () => {
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get("http://localhost:3333/student");
            setUser(response.data);
        } catch (err: any) {
            console.error("Error saat fetching data:", err);
            setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
        } finally {
            setLoading(false);
        }
    };

    const filteredClaims = claims.filter((claim) => {
        // Filter berdasarkan status
        const statusMatch = claim.statusInsurance === statusInsurance;

        // Filter berdasarkan pencarian
        const searchLower = searchQuery.toLowerCase();
        const searchMatch =
            claim.name.toLowerCase().includes(searchLower) ||
            claim.nis?.toLowerCase().includes(searchLower) ||
            claim.class?.toLowerCase().includes(searchLower) ||
            claim.insuranceType?.toLowerCase().includes(searchLower) ||
            claim.date.toLowerCase().includes(searchLower);

        // Mengembalikan item yang sesuai dengan status dan pencarian
        return statusMatch && (searchQuery === "" || searchMatch);
    });

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">
                        Pengajuan Klaim Asuransi Siswa
                    </h1>
                    <p className="text-sm text-gray-600">
                        Halo Admin Kesiswaan, selamat datang kembali
                    </p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                        <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            className="border-0 focus:outline-none text-base w-40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="px-9 pb-6 mt-5">
                <div className="flex items-center space-x-2 text-sm sm:text-lg mb-6">
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${statusInsurance === "Pending" ? "font-semibold" : ""}`}
                        onClick={() => setStatusInsurance("Pending")}
                    >
                        Pending
                    </button>
                    <span>/</span>
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${statusInsurance === "Disetujui" ? "font-semibold" : ""}`}
                        onClick={() => setStatusInsurance("Disetujui")}
                    >
                        Disetujui
                    </button>
                    <span>/</span>
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${statusInsurance === "Ditolak" ? "font-semibold" : ""}`}
                        onClick={() => setStatusInsurance("Ditolak")}
                    >
                        Ditolak
                    </button>
                </div>

                <div className="space-y-8">
                    {filteredClaims.length > 0 ? (
                        filteredClaims.map((claim) => {
                            const { textColor, bgColor } = getStatusStyle(claim.statusInsurance);
                            return (
                                <div
                                    key={claim.id}
                                    className="flex justify-between items-center bg-white shadow rounded-lg px-4 py-6 mb-4 cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleCardClick(claim)}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[#e88e1f2a] rounded-full w-10 h-10 p-2 mr-4 flex items-center justify-center">
                                            <i className="bx bxs-id-card text-[var(--second-color)] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[var(--text-semi-bold-color)]">
                                                {claim.name}
                                            </p>
                                            <p className="text-xs sm:text-sm text-[var(--text-thin-color)]">
                                                Tanggal Pengajuan: {claim.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 flex justify-center items-center py-1 rounded-full ${bgColor}`}>
                                        <span className={`text-xs ${textColor}`}>{claim.statusInsurance}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <i className='bx bx-search text-gray-400 text-5xl'></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Data Tidak Ditemukan
                            </h3>
                            <p className="text-gray-500">
                                Tidak ada data yang sesuai dengan pencarian Anda
                            </p>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <ClaimModal
                        selectedClaim={selectedClaim}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirm}
                        onReject={handleReject}
                    />
                )}
            </main>
        </div>
    );
}