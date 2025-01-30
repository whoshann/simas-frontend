import React from 'react';
import { ClaimData } from '@/app/api/insurance-modal/types';
import { InsuranceClaimCategoryLabel, getInsuranceClaimCategoryLabel } from '@/app/utils/enumHelpers';
import { InsuranceClaimCategory, InsuranceClaimStatus } from '@/app/utils/enums';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface ClaimModalProps {
    selectedClaim: ClaimData | null;
    onClose: () => void;
    refreshData: () => void | Promise<void>; 
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
};

const ClaimModal: React.FC<ClaimModalProps> = ({
    selectedClaim,
    onClose,
    refreshData
}) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!selectedClaim) return null;

    const updateClaimStatus = async (status: InsuranceClaimStatus) => {
        try {
            setIsLoading(true);
            const token = Cookies.get("token");
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/insurance-claim/${selectedClaim?.id}/status`,
                { statusInsurance: status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            refreshData();
            onClose();
        } catch (error) {
            console.error('Error updating claim status:', error);
            alert('Gagal mengupdate status klaim');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg w-full max-w-2xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[var(--text-semi-bold-color)]">
                            Detail Pengajuan Klaim
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <i className='bx bx-x text-2xl'></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Baris 1: Nama dan Kelas */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Nama Lengkap</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.student?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kelas</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.student?.class?.name}
                                </p>
                            </div>
                        </div>

                        {/* Baris 2: NIS dan Jenis Asuransi */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">NIS</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.student?.nis}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Jenis Asuransi</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {getInsuranceClaimCategoryLabel(selectedClaim.category as InsuranceClaimCategory)}
                                </p>
                            </div>
                        </div>

                        {/* Baris 3: Tanggal Kejadian dan Nama Ibu */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Kejadian</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {formatDate(selectedClaim.claimDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nama Ibu</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.motherName}
                                </p>
                            </div>
                        </div>

                        {/* Baris 4: Nama Ayah dan Alasan Klaim */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Nama Ayah</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.fatherName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Alasan Klaim</p>
                                <p className="font-medium text-[var(--text-semi-bold-color)]">
                                    {selectedClaim.reason}
                                </p>
                            </div>
                        </div>

                        {/* Bukti Pendukung */}
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Bukti Pendukung</p>
                            <div className="border rounded-lg p-2">
                                {selectedClaim.photo ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/insurance-claim/${selectedClaim.photo.split('/').pop()}`}
                                        alt="Bukti pendukung"
                                        className="w-full h-48 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded">
                                        <p className="text-gray-400">Tidak ada gambar</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status dan Tombol Aksi */}
                        {selectedClaim.statusInsurance === "Pending" ? (
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => updateClaimStatus(InsuranceClaimStatus.Rejected)}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Memproses...' : 'Tolak'}
                                </button>
                                <button
                                    onClick={() => updateClaimStatus(InsuranceClaimStatus.Approved)}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-[var(--third-color)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Memproses...' : 'Konfirmasi'}
                                </button>
                            </div>
                        ) : (
                            <div className={`p-4 rounded-lg ${
                                selectedClaim.statusInsurance === "Approved" 
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                <div className="flex items-center">
                                    <i className={`bx ${
                                        selectedClaim.statusInsurance === "Approved"
                                            ? "bx-check text-green-500"
                                            : "bx-x text-red-500"
                                    } text-2xl mr-2`}></i>
                                    <p className="font-medium">
                                        {selectedClaim.statusInsurance === "Approved"
                                            ? "Klaim ini telah disetujui"
                                            : "Klaim ini telah ditolak"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimModal;