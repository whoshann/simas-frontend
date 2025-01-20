"use client";

import React from 'react';
import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { authApi } from "@/app/api/auth";
import { getTokenData } from "@/app/utils/tokenHelper";


export default function StudentClaimInsurancePage() {
    // Panggil middleware dan hooks di awal komponen
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student"]);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializePage();

        const tokenData = getTokenData();
        if (tokenData) {
            // Gunakan tokenData.id (dari sub) untuk fetch data user
            fetchStudentData(tokenData.id);
            setStudent(prev => ({
                ...prev,
                role: tokenData.role
            }));
        }
    }, []);

    const fetchStudentData = async (userId: number) => {
        try {
            const response = await authApi.getStudentLogin(userId);
            setStudent(response.data); // Asumsi response.data sudah sesuai dengan tipe Student
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data");
        }
    };

    const [student, setStudent] = useState<any>({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);


    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pengajuan Klaim Asuransi</h1>
                <p className="text-sm text-[var(--text-regular-color)]">Halo James, selamat datang di halaman Klaim Asuransi</p>
            </header>

            <main className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Start Form Input */}
                    <div className="bg-white rounded-lg shadow p-6">

                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
                            <div className="bg-[#e88e1f29] flex justify-center items-center rounded-full h-7 w-7 p-2">
                                <i className='bx bxs-folder-open text-[var(--second-color)] text-lg '></i>
                            </div>
                            <span className="ml-2">Pengajuan Klaim Asuransi</span>
                        </h2>
                        <form className="space-y-6">

                            <div>
                                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">
                                    Pilih Jenis Asuransi :
                                </label>
                                <select
                                    id="insurance"
                                    name="insurance"
                                    className="mt-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 pr-10"
                                >
                                    <option>Orang tua meninggal</option>
                                    <option>Kecelakaan</option>
                                    <option>Speaker</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Masukkan Tanggal Kejadian :
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="dadName" className="block text-sm font-medium text-gray-700">
                                    Masukkan nama ayah atau wali
                                </label>
                                <input
                                    type="text"
                                    id="dadName"
                                    name="dadName"
                                    placeholder="Sugianto Asmoro"
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="momName" className="block text-sm font-medium text-gray-700">
                                    Masukkan nama ibu atau wali
                                </label>
                                <input
                                    type="text"
                                    id="momName"
                                    name="momName"
                                    placeholder="Inawarti Rusiana"
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Masukkan alasan pengajuan asuransi
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    placeholder="Karena membutuhkan dana bantuan"
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white resize-none"
                                    rows={3} 
                                />
                            </div>

                            <div>
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                    Masukkan foto bukti pendukung
                                </label>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    placeholder="Karena membutuhkan dana bantuan"
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>


                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#1f509a] text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-[#1f509a]/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* End Form Input */}


                    {/* Start History Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4">Riwayat Klaim</h2>
                        <div className="space-y-8">


                            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-[#bd00002a] rounded-full h-10 w-10 p-2 mr-4">
                                        <i className='bx bxs-x-circle text-[var(--fourth-color)] text-2xl '></i> {/* Ikon Ditolak */}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm ">Kecelakaan</p>
                                        <p className="text-xs sm:text-sm  text-gray-500">Tanggal: 20/01/2024</p>
                                    </div>
                                </div>
                                <div className=" px-4 flex justify-center items-center py-1 rounded-full bg-[#bd000026]">
                                    <span className="text-xs text-[var(--fourth-color)]">Ditolak</span>
                                </div>
                            </div>


                            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-[#e88e1f29] rounded-full w-10 h-10 p-2 mr-4">
                                        <i className='bx bxs-error-circle text-[var(--second-color)] text-2xl '></i> {/* Ikon Pending */}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm ">Orang tua meninggal</p>
                                        <p className="text-xs sm:text-sm  text-gray-500">Tanggal: 20/01/2024</p>
                                    </div>
                                </div>
                                <div className=" px-4 flex justify-center items-center py-1 rounded-full bg-[#e88e1f29]">
                                    <span className="text-xs text-[var(--second-color)]">Pending</span>
                                </div>
                            </div>


                            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-[#0a97b028] rounded-full w-10 h-10 p-2 mr-4">
                                        <i className='bx bxs-check-circle text-[var(--third-color)] text-2xl '></i> {/* Ikon Disetujui */}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm ">Kecelakaan</p>
                                        <p className="text-xs sm:text-sm  text-gray-500">Tanggal: 20/01/2024</p>
                                    </div>
                                </div>
                                <div className=" px-4 flex justify-center items-center py-1 rounded-full bg-[#0a97b028]">
                                    <span className="text-xs text-[var(--third-color)]">Disetujui</span>
                                </div>
                            </div>


                            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-[#e88e1f2a] rounded-full w-10 h-10 p-2 mr-4">
                                        <i className='bx bxs-error-circle text-[var(--second-color)] text-2xl '></i> {/* Ikon Pending */}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm ">Kecelakaan</p>
                                        <p className="text-xs sm:text-sm  text-gray-500">Tanggal: 20/01/2024</p>
                                    </div>
                                </div>
                                <div className=" px-4 flex justify-center items-center py-1 rounded-full bg-[#e88e1f29]">
                                    <span className="text-xs text-[var(--second-color)]">Pending</span>
                                </div>
                            </div>


                        </div>
                    </div>
                    {/* End History Card */}


                </div>
            </main>
        </div>
    );
}
