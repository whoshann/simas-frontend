"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import ClaimModal from '@/app/components/insurance-modal/ClaimModal';
import { ClaimData, StatusInsurance } from '@/app/api/insurance-modal/types';
import Cookies from "js-cookie";
import { InsuranceClaimCategory } from "@/app/utils/enums";
import { InsuranceClaimStatus } from "@/app/utils/enums";
import axios from "axios";
import { InsuranceClaimCategoryLabel } from "@/app/utils/enumHelpers";

export default function StudentAffairsClaimInsurancePage() {
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                setIsAuthorized(true);
                await fetchInsuranceClaim();
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
                setError('Anda tidak memiliki akses ke halaman ini');
            } finally {
                setIsLoading(false);
            }
        };
        initializePage();
    }, []);

    const [error, setError] = useState<string>("");
    const [statusInsurance, setStatusInsurance] = useState<string>("");
    const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    interface InsuranceClaim {
        id: number;
        studentId: number;
        student?: {
            name?: string;
            nis?: string;
            class?: {
                name?: string,
            }
        };
        category: InsuranceClaimCategory;
        claimDate: string;
        fatherName: string;
        motherName: string;
        reason: string;
        photo: string;
        statusInsurance: InsuranceClaimStatus;
    }

    const fetchInsuranceClaim = async () => {
        try {
            setIsLoading(true);
            const token = Cookies.get("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/insurance-claim`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                setInsuranceClaims(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching insurance claims:', error);
            setInsuranceClaims([]);
        }
    };

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

    const getStatusStyle = (statusInsurance: string) => {
        switch (statusInsurance) {
            case "Pending":
                return { textColor: "text-[var(--second-color)]", bgColor: "bg-[#e88e1f29]" };
            case "Approved":
                return { textColor: "text-[var(--third-color)]", bgColor: "bg-[#0a97b028]" };
            case "Rejected":
                return { textColor: "text-[var(--fourth-color)]", bgColor: "bg-[#bd00002a]" };
            default:
                return { textColor: "text-gray-600", bgColor: "bg-gray-100" };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'Disetujui';
            case 'Rejected':
                return 'Ditolak';
            default:
                return 'Pending';
        }
    };

    const filteredClaims = insuranceClaims.filter((claim) => {
        // Filter berdasarkan status
        if (statusInsurance) {
            const statusMatch = statusInsurance === 'Disetujui' ? claim.statusInsurance === 'Approved' :
                statusInsurance === 'Ditolak' ? claim.statusInsurance === 'Rejected' :
                    claim.statusInsurance === 'Pending';
            if (!statusMatch) return false;
        }

        // Filter berdasarkan pencarian
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
                claim.student?.name?.toLowerCase().includes(searchLower) ||
                claim.student?.nis?.toLowerCase().includes(searchLower) ||
                claim.student?.class?.name?.toLowerCase().includes(searchLower) ||
                InsuranceClaimCategoryLabel[claim.category]?.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    useEffect(() => {
        fetchInsuranceClaim();
    }, []); // Fetch saat komponen dimount

    // Helper function untuk format tanggal
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const refreshData = async () => {
        try {
            setIsLoading(true);
            await fetchInsuranceClaim();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
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
                        className={`text-[var(--text-semi-bold-color)] ${statusInsurance === "" ? "font-semibold" : ""}`}
                        onClick={() => setStatusInsurance("")}
                    >
                        Semua
                    </button>
                    <span>/</span>
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
                                                {claim.student?.name}
                                            </p>
                                            <p className="text-xs sm:text-sm text-[var(--text-thin-color)]">
                                                NIS: {claim.student?.nis} | Kelas: {claim.student?.class?.name} | {InsuranceClaimCategoryLabel[claim.category]}
                                            </p>
                                            <p className="text-xs sm:text-sm text-[var(--text-thin-color)]">
                                                Tanggal Kejadian: {formatDate(claim.claimDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 flex justify-center items-center py-1 rounded-full ${bgColor}`}>
                                        <span className={`text-xs ${textColor}`}>
                                            {claim.statusInsurance === 'Pending' ? 'Pending' :
                                                claim.statusInsurance === 'Approved' ? 'Disetujui' : 'Ditolak'}
                                        </span>
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
                        refreshData={refreshData}
                    />
                )}
            </main>
        </div>
    );
}