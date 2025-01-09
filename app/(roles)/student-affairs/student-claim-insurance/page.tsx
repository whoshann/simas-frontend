"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

// Mendefinisikan tipe status klaim
type Status = "Pending" | "Disetujui" | "Ditolak";

export default function StudentAffairsClaimInsurancePage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'StudentAffairs'
        roleMiddleware(["StudentAffairs"]);
    }, []);

    // State untuk status breadcrumb
    const [status, setStatus] = useState<Status>("Pending");

    // Data dummy untuk klaim asuransi
    const claims = [
        { id: 1, name: "Ilham", date: "20/01/2024", status: "Pending", icon: "bx bxs-id-card" },
        { id: 2, name: "Imron", date: "20/01/2024", status: "Pending", icon: "bx bxs-id-card" },
        { id: 3, name: "Ilham", date: "20/01/2024", status: "Pending", icon: "bx bxs-id-card" },
        { id: 4, name: "Rina", date: "20/01/2024", status: "Pending", icon: "bx bxs-id-card" },
        { id: 5, name: "Toni", date: "20/01/2024", status: "Pending", icon: "bx bxs-id-card" },

        { id: 6, name: "Budi", date: "21/01/2024", status: "Disetujui", icon: "bx bxs-id-card" },
        { id: 7, name: "Siti", date: "21/01/2024", status: "Disetujui", icon: "bx bxs-id-card" },
        { id: 8, name: "Eka", date: "21/01/2024", status: "Disetujui", icon: "bx bxs-id-card" },
        { id: 9, name: "Wawan", date: "21/01/2024", status: "Disetujui", icon: "bx bxs-id-card" },

        { id: 10, name: "Joko", date: "22/01/2024", status: "Ditolak", icon: "bx bxs-id-card" },
        { id: 11, name: "Nina", date: "22/01/2024", status: "Ditolak", icon: "bx bxs-id-card" },
        { id: 12, name: "Rosa", date: "22/01/2024", status: "Ditolak", icon: "bx bxs-id-card" },
    ];

    // Filter klaim berdasarkan status breadcrumb
    const filteredClaims = claims.filter((claim) => claim.status === status);

    // Mengatur warna background dan teks berdasarkan status
    const getStatusStyle = (status: Status) => {
        switch (status) {
            case "Pending":
                return { textColor: "text-[var(--second-color)]", bgColor: "bg-[#e88e1f29]" }; // warna untuk pending
            case "Disetujui":
                return { textColor: "text-[var(--third-color)]", bgColor: "bg-[#0a97b028]" }; // warna untuk disetujui
            case "Ditolak":
                return { textColor: "text-[var(--fourth-color)]", bgColor: "bg-[#bd00002a]" }; // warna untuk ditolak
            default:
                return { textColor: "text-gray-600", bgColor: "bg-gray-100" }; // default warna
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pengajuan Klaim Asuransi Siswa</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>

                {/* Filtering Bulanan */}
                <div className="mt-4 sm:mt-0">
                    <div className=" bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                        <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            className="border-0 focus:outline-none text-base w-40"
                        />
                    </div>
                </div>
            </header>

            <main className="px-9 pb-6 mt-5">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm sm:text-lg mb-6">
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${status === "Pending" ? "font-semibold" : ""}`}
                        onClick={() => setStatus("Pending" as Status)} // Pastikan menggunakan 'as Status'
                    >
                        Pending
                    </button>
                    <span>/</span>
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${status === "Disetujui" ? "font-semibold" : ""}`}
                        onClick={() => setStatus("Disetujui" as Status)} // Pastikan menggunakan 'as Status'
                    >
                        Disetujui
                    </button>
                    <span>/</span>
                    <button
                        className={`text-[var(--text-semi-bold-color)] ${status === "Ditolak" ? "font-semibold" : ""}`}
                        onClick={() => setStatus("Ditolak" as Status)} // Pastikan menggunakan 'as Status'
                    >
                        Ditolak
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Menampilkan Card Berdasarkan Status */}
                    {filteredClaims.map((claim) => {
                        const { textColor, bgColor } = getStatusStyle(claim.status);
                        return (
                            <div key={claim.id} className="flex justify-between items-center bg-white shadow rounded-lg px-4 py-6 mb-4">
                                <div className="flex items-center">
                                    <div className="bg-[#e88e1f2a] rounded-full w-10 h-10 p-2 mr-4">
                                        <i className={`bx ${claim.icon} text-[var(--second-color)] text-2xl`}></i> {/* Ikon status */}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-[var(--text-semi-bold-color)]">{claim.name}</p>
                                        <p className="text-xs sm:text-sm text-[var(--text-thin-color)]">Tanggal Pengajuan: {claim.date}</p>
                                    </div>
                                </div>
                                <div className={`px-4 flex justify-center items-center py-1 rounded-full ${bgColor}`}>
                                    <span className={`text-xs ${textColor}`}>{claim.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
