"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import FormModal from "@/app/components/DataTable/FormModal";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmployeeGender, EmployeeCategory } from "@/app/utils/enums";
import { getEmployeeGenderLabel, getEmployeeCategoryLabel } from "@/app/utils/enumHelpers";
import { useEmployee } from "@/app/hooks/useEmployee";
import { useUser } from "@/app/hooks/useUser";
import { exportToExcel, ExportConfigs } from '@/app/utils/exportToExcel';

export default function EmployeePage() {
    // State Management
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedData, setSelectedData] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useUser();

    // Gunakan custom hook untuk employees (perlu dibuat)
    const { employee, loading, error, fetchEmployee, createEmployee, updateEmployee, deleteEmployee } = useEmployee();

    const [formData, setFormData] = useState({
        photo: null,
        fullName: '',
        gender: '',
        placeOfBirth: '',
        dateOfBirth: '',
        fullAddress: '',
        lastEducation: '',
        lastEducationMajor: '',
        phoneNumber: '',
        category: '',
        maritalStatus: ''
    });

    // Form fields configuration
    const formFields = [
        {
            name: 'photo',
            label: 'Foto',
            type: 'file' as const,
            required: false,
            accept: 'image/*'
        },
        {
            name: 'fullName',
            label: 'Nama Lengkap',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama lengkap'
        },
        {
            name: 'gender',
            label: 'Jenis Kelamin',
            type: 'select' as const,
            required: true,
            options: [
                { value: EmployeeGender.Male, label: 'Laki-laki' },
                { value: EmployeeGender.Female, label: 'Perempuan' }
            ]
        },
        {
            name: 'dateOfBirth',
            label: 'Tanggal Lahir',
            type: 'date' as const,
            required: true
        },
        {
            name: 'placeOfBirth',
            label: 'Tempat Lahir',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan tempat lahir'
        },
        {
            name: 'fullAddress',
            label: 'Alamat Lengkap',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan alamat lengkap'
        },
        {
            name: 'phoneNumber',
            label: 'Nomor Telepon',
            type: 'tel' as const,
            required: true,
            placeholder: 'Contoh: 081234567890',
            validate: (value: string) => {
                // Hapus karakter non-digit untuk validasi
                const cleaned = value.replace(/\D/g, '');

                // Validasi panjang dan format dasar
                if (!cleaned.startsWith('0')) {
                    return 'Nomor telepon harus diawali dengan 0';
                }

                if (cleaned.length < 10 || cleaned.length > 13) {
                    return 'Nomor telepon harus 10-13 digit';
                }

                if (!/^0[1-9][0-9]{8,11}$/.test(cleaned)) {
                    return 'Format nomor telepon tidak valid';
                }

                return '';
            }
        },
        {
            name: 'lastEducation',
            label: 'Pendidikan Terakhir',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'SD', label: 'SD' },
                { value: 'SMP', label: 'SMP' },
                { value: 'SMA/SMK', label: 'SMA/SMK' },
                { value: 'D3', label: 'D3' },
                { value: 'S1', label: 'S1' },
                { value: 'S2', label: 'S2' }
            ]
        },
        {
            name: 'lastEducationMajor',
            label: 'Jurusan Pendidikan Terakhir',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan jurusan'
        },
        {
            name: 'category',
            label: 'Kategori',
            type: 'select' as const,
            required: true,
            options: [
                { value: EmployeeCategory.PTT, label: 'Pegawai Tidak Tetap' },
                { value: EmployeeCategory.Security, label: 'Security' },
                { value: EmployeeCategory.CS, label: 'Cleaning Services' }
            ]
        },
        {
            name: 'maritalStatus',
            label: 'Status Pernikahan',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Belum Menikah', label: 'Belum Menikah' },
                { value: 'Menikah', label: 'Menikah' },
                { value: 'Cerai', label: 'Cerai' }
            ]
        }
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                await fetchEmployee();
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Modal handlers
    const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && data) {
            setFormData({
                ...data,
                phoneNumber: formatPhoneNumberForDisplay(data.phoneNumber),
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
                photo: null
            });
            setSelectedData(data);
        } else {
            setFormData({
                photo: null,
                fullName: '',
                gender: '',
                placeOfBirth: '',
                dateOfBirth: '',
                fullAddress: '',
                lastEducation: '',
                lastEducationMajor: '',
                phoneNumber: '',
                category: '',
                maritalStatus: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
        setFormData({
            photo: null,
            fullName: '',
            gender: '',
            placeOfBirth: '',
            dateOfBirth: '',
            fullAddress: '',
            lastEducation: '',
            lastEducationMajor: '',
            phoneNumber: '',
            category: '',
            maritalStatus: ''
        });
    };

    // Form submission handler
    const handleSubmit = async (formData: any) => {
        try {
            const { id, createdAt, updatedAt, picture, ...cleanedData } = formData;

            const formattedData = {
                ...cleanedData,
                // Format nomor telepon sebelum dikirim
                phoneNumber: formatPhoneNumberForSubmit(formData.phoneNumber),
                dateOfBirth: new Date(formData.dateOfBirth).toISOString()
            };

            if (modalMode === 'add') {
                await createEmployee(formattedData);
                await showSuccessAlert('Berhasil', 'Data karyawan berhasil ditambahkan');
            } else if (modalMode === "edit" && selectedData?.id) {
                await updateEmployee(selectedData.id, formattedData);
                await showSuccessAlert('Berhasil', 'Data karyawan berhasil diperbarui');
            }
            handleCloseModal();
            await fetchEmployee();
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menyimpan data karyawan');
        }
    };


    // Delete handler
    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Karyawan',
            'Apakah Anda yakin ingin menghapus data karyawan ini?'
        );

        if (isConfirmed) {
            try {
                await deleteEmployee(id);
                await showSuccessAlert('Berhasil', 'Data karyawan berhasil dihapus');
                await fetchEmployee();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data karyawan');
            }
        }
    };

    // Fungsi untuk format nomor telepon
    const formatPhoneNumberForDisplay = (phone: string) => {
        if (!phone) return '';
        // Hapus semua karakter non-digit
        const cleaned = phone.replace(/\D/g, '');
        // Jika dimulai dengan 0, ganti dengan +62
        if (cleaned.startsWith('0')) {
            return `+62${cleaned.slice(1)}`;
        }
        // Jika sudah dalam format +62, kembalikan apa adanya
        if (cleaned.startsWith('62')) {
            return `+${cleaned}`;
        }
        return `+62${cleaned}`;
    };

    // Fungsi untuk format nomor telepon sebelum dikirim ke server
    const formatPhoneNumberForSubmit = (phone: string) => {
        if (!phone) return '';
        // Hapus semua karakter non-digit dan +
        const cleaned = phone.replace(/\D/g, '');
        // Jika dimulai dengan 62, kembalikan tanpa +
        if (cleaned.startsWith('62')) {
            return cleaned;
        }
        // Jika dimulai dengan 0, hapus 0 dan tambah 62
        if (cleaned.startsWith('0')) {
            return `62${cleaned.slice(1)}`;
        }
        return `62${cleaned}`;
    };

    // Search and pagination logic
    const filteredData = employee.filter(item =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.placeOfBirth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleExport = () => {
        if (filteredData && filteredData.length > 0) {
            const formattedData = filteredData.map((item, index) => ({
                'No': index + 1,
                'Nama Lengkap': item.fullName,
                'Jenis Kelamin': getEmployeeGenderLabel(item.gender),
                'Tempat Lahir': item.placeOfBirth,
                'Tanggal Lahir': format(new Date(item.dateOfBirth), 'dd MMMM yyyy', { locale: id }),
                'Alamat': item.fullAddress,
                'Pendidikan Terakhir': item.lastEducation,
                'Jurusan': item.lastEducationMajor,
                'Nomor Telepon': item.phoneNumber,
                'Kategori': getEmployeeCategoryLabel(item.category),
                'Status Pernikahan': item.maritalStatus,
                'Tanggal Dibuat': item.createdAt ? format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: id }) : '-',
                'Terakhir Diupdate': item.updatedAt ? format(new Date(item.updatedAt), 'dd MMMM yyyy', { locale: id }) : '-'
            }));

            exportToExcel(formattedData, 'Data Karyawan');
        } else {
            console.error('Tidak ada data untuk diekspor');
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
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Karyawan</h1>
                    <p className="text-sm text-gray-600">Halo {user?.username || 'User'}, selamat datang kembali</p>
                </div>

                <div className="mt-4 sm:mt-0">
                    <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                        <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 focus:outline-none text-base w-40"
                        />
                    </div>
                </div>
            </header>

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    {/* Table controls */}
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

                        <div className="flex space-x-2 mt-5 sm:mt-0">
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                            >
                                Tambah Data
                            </button>

                            <button
                                onClick={() => console.log("Import CSV")}
                                className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                            >
                                Import Dari Excel
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="bg-[var(--third-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#09859a] flex items-center"
                                >
                                    Export Data
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className={`w-4 h-4 ml-2 transform transition-transform ${dropdownOpen ? 'rotate-90' : 'rotate-0'}`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => console.log("Export PDF")}
                                            className="block w-full text-left text-[var(--text-regular-color)] px-4 py-2 hover:bg-gray-100"
                                        >
                                            Export PDF
                                        </button>
                                        <button
                                            onClick={handleExport}
                                            className="block w-full text-left text-[var(--text-regular-color)] px-4 py-2 hover:bg-gray-100"
                                        >
                                            Export Excel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Foto</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Lengkap</th>
                                    <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                                    <th className="py-2 px-4 border-b text-left">Nomor Telepon</th>
                                    <th className="py-2 px-4 border-b text-left">Pendidikan Terakhir</th>
                                    <th className="py-2 px-4 border-b text-left">Jurusan</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Status Pernikahan</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {item.photo ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/employees/${item.photo.split('/').pop()}`}
                                                        alt="Foto Profile"
                                                        className="w-full h-full object-cover"
                                                        width={256}
                                                        height={256}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.fullName}</td>
                                        <td className="py-2 px-4 border-b">{getEmployeeGenderLabel(item.gender)}</td>
                                        <td className="py-2 px-4 border-b">{format(new Date(item.dateOfBirth), 'dd MMMM yyyy', { locale: id })}</td>
                                        <td className="py-2 px-4 border-b">{item.placeOfBirth}</td>
                                        <td className="py-2 px-4 border-b">{item.fullAddress}</td>
                                        <td className="py-2 px-4 border-b">
                                            {formatPhoneNumberForDisplay(item.phoneNumber)}
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.lastEducation}</td>
                                        <td className="py-2 px-4 border-b">{item.lastEducationMajor}</td>
                                        <td className="py-2 px-4 border-b">{getEmployeeCategoryLabel(item.category)}</td>
                                        <td className="py-2 px-4 border-b">{item.maritalStatus}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', item)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                                >
                                                    <i className="bx bxs-trash-alt text-lg"></i>
                                                </button>
                                            </div>
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

                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`rounded-md px-3 py-1 ${currentPage === index + 1 ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'
                                            }`}
                                    >
                                        {index + 1}
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

            {/* Form Modal */}
            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Data Karyawan' : 'Edit Data Karyawan'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div>
    );
}