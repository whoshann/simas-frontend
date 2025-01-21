"use client";
import "@/app/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";

interface FormData {
    userId: number;
    title: string;
    description: string;
    total_budget: number;
    document_path?: File;
}

const formatRupiah = (angka: string) => {
    const number = angka.replace(/[^,\d]/g, '').toString();
    const split = number.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return `Rp ${rupiah}`;
};

const staticHistory = [
    {
        id: 1,
        title: "Pengadaan Alat Laboratorium",
        submissionDate: "2024-03-15",
        amount: "Rp 15.000.000",
        status: "Pending"
    },
    {
        id: 2,
        title: "Renovasi Ruang Kelas",
        submissionDate: "2024-03-10",
        amount: "Rp 25.000.000",
        status: "Approved"
    },
    {
        id: 3,
        title: "Pembelian Buku Perpustakaan",
        submissionDate: "2024-03-05",
        amount: "Rp 8.000.000",
        status: "Rejected"
    }
];

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
        default:
            return {
                iconBg: 'bg-[#e88e1f29]',
                icon: 'bx bxs-error-circle text-[var(--second-color)]',
                badgeBg: 'bg-[#e88e1f29]',
                textColor: 'text-[var(--second-color)]',
                text: 'Pending'
            };
    }
};

export default function StudentAffairsBudgetProposalPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [jumlahDana, setJumlahDana] = useState('');
    const [formData, setFormData] = useState<FormData>({
        userId: 0,
        title: '',
        description: '',
        total_budget: 0
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                setIsAuthorized(true);

                const id = getUserIdFromToken();
                if (id) {
                    setUserId(id);
                    setFormData(prev => ({
                        ...prev,
                        userId: Number(id)
                    }));
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJumlahDanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedValue = numericValue ? formatRupiah(numericValue) : '';
        setJumlahDana(formattedValue);
        setFormData(prev => ({
            ...prev,
            total_budget: Number(numericValue)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Hanya file PDF yang diperbolehkan');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitFormData = new FormData();
        submitFormData.append('userId', formData.userId.toString());
        submitFormData.append('title', formData.title);
        submitFormData.append('description', formData.description);
        submitFormData.append('total_budget', formData.total_budget.toString());

        if (selectedFile) {
            submitFormData.append('document_path', selectedFile);
        }

        try {
            const token = Cookies.get("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/budget-estimate-plan`,
                submitFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.status === 201) {
                setFormData({
                    userId: formData.userId,
                    title: '',
                    description: '',
                    total_budget: 0
                });
                setSelectedFile(null);
                setJumlahDana('');

                const fileInput = document.getElementById('document_path') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                alert('Pengajuan RAB berhasil dikirim!');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Gagal mengirim pengajuan RAB');
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-gray-800">Pengajuan RAB</h1>
                <p className="text-sm text-gray-600">Halo, selamat datang di halaman Pengajuan RAB</p>
            </header>

            {/* Alert Section */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-6 py-4 mx-9 flex items-start mb-6">
                <i className="bx bx-info-circle text-2xl mr-3"></i>
                <div>
                    <p className="text-sm font-medium">
                        Untuk mempermudah proses pengajuan RAB, silakan baca panduan lengkap terlebih dahulu.
                    </p>
                    <button
                        type="button"
                        className="mt-2 text-sm text-blue-600 hover:underline font-medium focus:outline-none"
                    >
                        Lihat Panduan
                    </button>
                </div>
            </div>

            <main className="px-9 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
                            <span className="ml-2">Form Pengajuan RAB</span>
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Nama Rencana Anggaran Biaya
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Gelar Karya Pembelajaran"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="total_budget" className="block text-sm font-medium text-gray-700">
                                    Jumlah Dana Yang Diajukan
                                </label>
                                <input
                                    type="text"
                                    id="total_budget"
                                    name="total_budget"
                                    value={jumlahDana}
                                    onChange={handleJumlahDanaChange}
                                    placeholder="Rp 600.000"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="document_path" className="block text-sm font-medium text-gray-700">
                                    Document Pengajuan RAB (PDF)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="file"
                                        id="document_path"
                                        name="document_path"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Alasan Pengajuan Rencana Anggaran Biaya
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>

                    {/* History Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
                            <div className="bg-[#e88e1f29] flex justify-center items-center rounded-full h-7 w-7 p-2">
                                <i className='bx bx-history text-[var(--second-color)] text-lg'></i>
                            </div>
                            <span className="ml-2">Riwayat Pengajuan RAB</span>
                        </h2>
                        <div className="space-y-8">
                            {staticHistory.map((item) => {
                                const statusStyle = getStatusStyle(item.status);

                                return (
                                    <div key={item.id} className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className={`${statusStyle.iconBg} rounded-full h-10 w-10 p-2 mr-4`}>
                                                <i className={`${statusStyle.icon} text-2xl`}></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Tanggal: {new Date(item.submissionDate).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Jumlah: {item.amount}
                                                </p>
                                                {item.status === 'Pending' && (
                                                    <p className="text-xs text-[var(--second-color)]">
                                                        Menunggu persetujuan dari admin
                                                    </p>
                                                )}
                                                {item.status === 'Approved' && (
                                                    <p className="text-xs text-[var(--third-color)]">
                                                        RAB telah disetujui
                                                    </p>
                                                )}
                                                {item.status === 'Rejected' && (
                                                    <p className="text-xs text-[var(--fourth-color)]">
                                                        RAB ditolak
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
                </div>
            </main>
        </div>
    );
}