"use client";

import React, { useCallback } from 'react';
import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { authApi } from "@/app/api/auth";
import { getTokenData } from "@/app/utils/tokenHelper";
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import axios from 'axios';
import { getInsuranceClaimCategoryLabel, InsuranceClaimCategoryLabel } from '@/app/utils/enumHelpers';
import { InsuranceClaimCategory, InsuranceClaimStatus } from '@/app/utils/enums';

interface CustomJwtPayload {
    sub: number;
}

interface InsuranceClaim {
    id: number;
    studentId: number;
    category: InsuranceClaimCategory;
    claimDate: string;
    fatherName: string;
    motherName: string;
    reason: string;
    photo: string;
    statusInsurance: InsuranceClaimStatus;
}

export default function StudentClaimInsurancePage() {
    const [studentId, setStudentId] = useState<string | null>(null);
    const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
    // Panggil middleware dan hooks di awal komponen
    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Student","SuperAdmin"]);
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
            fetchStudentData(tokenData.id);
            setStudent(prev => ({
                ...prev,
                role: tokenData.role
            }));
        }

        const token = Cookies.get("token");
        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                const id = decodedToken.sub;
                setStudentId(id.toString());
                setFormData(prev => ({
                    ...prev,
                    studentId: id
                }));
                // Panggil fetch insurance claim setelah dapat studentId
                fetchInsuranceClaim(id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const [formData, setFormData] = useState({
        studentId: 0,
        category: InsuranceClaimCategory.Accident,
        claimDate: new Date().toISOString().split('T')[0],
        fatherName: '',
        motherName: '',
        reason: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitFormData = new FormData();
        submitFormData.append('studentId', formData.studentId.toString());
        submitFormData.append('category', formData.category);
        submitFormData.append('claimDate', formData.claimDate);
        submitFormData.append('fatherName', formData.fatherName);
        submitFormData.append('motherName', formData.motherName);
        submitFormData.append('reason', formData.reason);

        if (selectedFile) {
            submitFormData.append('photo', selectedFile);
        }

        try {
            const token = Cookies.get("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/insurance-claim`,
                submitFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Tambahkan data baru ke insuranceClaims
            if (response.data && response.data.data) {
                setInsuranceClaims(prev => [...prev, response.data.data]);
            }

            // Reset form dan tampilkan alert
            setFormData({
                studentId: formData.studentId,
                category: InsuranceClaimCategory.Accident,
                claimDate: new Date().toISOString().split('T')[0],
                fatherName: '',
                motherName: '',
                reason: ''
            });
            setSelectedFile(null);
            alert('Klaim asuransi berhasil dikirim!');

            // Refresh data
            fetchInsuranceClaim(formData.studentId);
        } catch (error) {
            console.error('Error submitting claim:', error);
            alert('Gagal mengirim klaim asuransi. Silakan coba lagi.');
        }
    };

    const fetchStudentData = async (userId: number) => {
        try {
            const response = await authApi.getStudentLogin(userId);
            setStudent(response.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data");
        }
    };

    const fetchInsuranceClaim = async (studentId: number) => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/insurance-claim/student/${studentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Pastikan kita mengambil array dari response
            if (response.data && response.data.data) {
                const claimsData = Array.isArray(response.data.data)
                    ? response.data.data
                    : [response.data.data];

                setInsuranceClaims(claimsData);
            } else {
                console.error('Data tidak valid:', response.data);
                setInsuranceClaims([]);
            }
        } catch (error) {
            console.error('Error fetching insurance claims:', error);
            setInsuranceClaims([]);
        }
    };

    const [student, setStudent] = useState<any>({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Rejected':
                return {
                    iconBg: 'bg-[#bd00002a]',
                    icon: 'bx bxs-x-circle text-[var(--fourth-color)]',
                    badgeBg: 'bg-[#bd000026]',
                    textColor: 'text-[var(--fourth-color)]',
                    text: 'Ditolak'
                };
            case 'Approved':
                return {
                    iconBg: 'bg-[#0a97b028]',
                    icon: 'bx bxs-check-circle text-[var(--third-color)]',
                    badgeBg: 'bg-[#0a97b028]',
                    textColor: 'text-[var(--third-color)]',
                    text: 'Disetujui'
                };
            default: // Pending
                return {
                    iconBg: 'bg-[#e88e1f29]',
                    icon: 'bx bxs-error-circle text-[var(--second-color)]',
                    badgeBg: 'bg-[#e88e1f29]',
                    textColor: 'text-[var(--second-color)]',
                    text: 'Pending'
                };
        }
    };

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }, []);

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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="hidden"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Pilih Kategori Klaim
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                                    required
                                >
                                    {Object.values(InsuranceClaimCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {getInsuranceClaimCategoryLabel(category)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="claimDate" className="block text-sm font-medium text-gray-700">
                                    Masukkan Tanggal Kejadian 
                                </label>
                                <input
                                    type="date"
                                    id="claimDate"
                                    name="claimDate"
                                    value={formData.claimDate}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                                Masukkan Nama Ayah
                                </label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    name="fatherName"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                                    required
                                    placeholder='Imam Rusdi Kamali'
                                />
                            </div>

                            <div>
                                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                                    Masukkan Nama Ibu
                                </label>
                                <input
                                    type="text"
                                    id="motherName"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                                    required
                                    placeholder='Inawarti Rohana'
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Masukkan Alasan Pengajuan Klaim
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 resize-none"
                                    rows={3}
                                    required
                                    placeholder='Karena membutuhkan dana untuk berobat'
                                />
                            </div>

                            <div>
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                    Masukkan Bukti Pendukung
                                </label>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                                    required
                                />
                            </div>

                            <div>
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
                            {Array.isArray(insuranceClaims) && insuranceClaims.map((claim) => {
                                const statusStyle = getStatusStyle(claim.statusInsurance);

                                return (
                                    <div key={claim.id} className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className={`${statusStyle.iconBg} rounded-full h-10 w-10 p-2 mr-4`}>
                                                <i className={`${statusStyle.icon} text-2xl`}></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {InsuranceClaimCategoryLabel[claim.category]}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Tanggal: {formatDate(claim.claimDate)}
                                                </p>
                                                {claim.statusInsurance === 'Pending' && (
                                                    <p className="text-xs text-[var(--second-color)] ">
                                                        Menunggu persetujuan dari admin
                                                    </p>
                                                )}
                                                {/* Tambahkan pesan status */}
                                                {claim.statusInsurance === 'Approved' && (
                                                    <p className="text-xs text-[var(--third-color)]">
                                                        Silahkan pergi ke bagian bidang keuangan dengan membawa Fotocopy Kartu Keluarga
                                                    </p>
                                                )}
                                                {claim.statusInsurance === 'Rejected' && (
                                                    <p className="text-xs text-[var(--fourth-color)]">
                                                        Mohon maaf, klaim anda ditolak
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`px-4 flex justify-center items-center py-1 rounded-full ${statusStyle.badgeBg}`}>
                                            <span className={`text-xs ${statusStyle.textColor}`}>
                                                {statusStyle.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* End History Card */}


                </div>
            </main>
        </div>
    );
}
