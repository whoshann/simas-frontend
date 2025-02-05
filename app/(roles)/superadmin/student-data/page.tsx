"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import FormModal from "@/app/components/DataTable/FormModal";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Gender, Religion } from "@/app/utils/enums";
import { getGenderLabel, getReligionLabel } from "@/app/utils/enumHelpers";
import { useStudents } from "@/app/hooks/useStudent";
import { useSchoolClasses } from "@/app/hooks/useSchoolClassData";
import { useMajors } from "@/app/hooks/useMajorData";


export default function StudentPage() {
    // State Management
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedData, setSelectedData] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch data menggunakan custom hooks
    const { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent } = useStudents();
    const { schoolClasses, fetchSchoolClasses } = useSchoolClasses();
    const { majors, fetchMajors } = useMajors();

    const [formData, setFormData] = useState({
        name: '',
        nis: '',
        nisn: '',
        classId: '',
        majorId: '',
        birthDate: '',
        birthPlace: '',
        gender: '',
        address: '',
        phone: '',
        parentPhone: '',
        religion: '',
        motherName: '',
        fatherName: '',
        guardian: '',
        admissionYear: '',
        track: ''
    });

    // Form fields configuration
    const formFields = [
        {
            name: 'name',
            label: 'Nama Lengkap',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama lengkap'
        },
        {
            name: 'nis',
            label: 'NIS',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan NIS'
        },
        {
            name: 'nisn',
            label: 'NISN',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan NISN'
        },
        {
            name: 'classId',
            label: 'Kelas',
            type: 'select' as const,
            required: true,
            options: schoolClasses.map(cls => ({
                value: cls.id?.toString() || '',
                label: cls.name
            }))
        },
        {
            name: 'majorId',
            label: 'Jurusan',
            type: 'select' as const,
            required: true,
            options: majors.map(major => ({
                value: major.id.toString(),
                label: major.name
            }))
        },
        {
            name: 'birthDate',
            label: 'Tanggal Lahir',
            type: 'date' as const,
            required: true
        },
        {
            name: 'birthPlace',
            label: 'Tempat Lahir',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan tempat lahir'
        },
        {
            name: 'gender',
            label: 'Jenis Kelamin',
            type: 'select' as const,
            required: true,
            options: [
                { value: Gender.Male, label: 'Laki-laki' },
                { value: Gender.Female, label: 'Perempuan' }
            ]
        },
        {
            name: 'address',
            label: 'Alamat',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan alamat lengkap'
        },
        {
            name: 'phone',
            label: 'Nomor Telepon',
            type: 'tel' as const,
            required: true,
            placeholder: 'Contoh: 081234567890',
            validate: (value: string) => {
                // Hapus karakter non-digit
                const cleaned = value.replace(/\D/g, '');

                // Validasi dasar
                if (!cleaned.startsWith('0')) {
                    return 'Nomor telepon harus diawali dengan 0';
                }

                if (cleaned.length < 10 || cleaned.length > 13) {
                    return 'Nomor telepon harus 10-13 digit';
                }

                return '';
            }
        },
        {
            name: 'parentPhone',
            label: 'Nomor Telepon Orang Tua',
            type: 'tel' as const,
            required: true,
            placeholder: 'Contoh: 081234567890',
            validate: (value: string) => {
                // Hapus karakter non-digit
                const cleaned = value.replace(/\D/g, '');

                // Validasi dasar
                if (!cleaned.startsWith('0')) {
                    return 'Nomor telepon harus diawali dengan 0';
                }

                if (cleaned.length < 10 || cleaned.length > 13) {
                    return 'Nomor telepon harus 10-13 digit';
                }

                return '';
            }
        },
        {
            name: 'religion',
            label: 'Agama',
            type: 'select' as const,
            required: true,
            options: [
                { value: Religion.ISLAM, label: 'Islam' },
                { value: Religion.CHRISTIANITY, label: 'Kristen' },
                { value: Religion.CATHOLICISM, label: 'Katolik' },
                { value: Religion.HINDUISM, label: 'Hindu' },
                { value: Religion.BUDDHISM, label: 'Buddha' },
                { value: Religion.CONFUCIANISM, label: 'Konghucu' }
            ]
        },
        {
            name: 'motherName',
            label: 'Nama Ibu',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama ibu'
        },
        {
            name: 'fatherName',
            label: 'Nama Ayah',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama ayah'
        },
        {
            name: 'guardian',
            label: 'Nama Wali',
            type: 'text' as const,
            required: false,
            placeholder: 'Masukkan nama wali (opsional)'
        },
        {
            name: 'track',
            label: 'Jalur Masuk',
            type: 'text' as const,
            required: false,
            placeholder: 'Masukkan masuk siswa'
        },
        {
            name: 'admissionYear',
            label: 'Tahun Diterima',
            type: 'number' as const,
            required: true,
            placeholder: 'Masukkan tahun diterima',
            min: 2000,
            max: new Date().getFullYear()
        },

    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                await Promise.all([
                    fetchStudents(),
                    fetchSchoolClasses(),
                    fetchMajors()
                ]);
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Handle modal functions
    const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && data) {

            const formattedDate = data.birthDate ? new Date(data.birthDate).toISOString() : '';
            setFormData({
                ...data,
                birthDate: formattedDate.split('T')[0], 
                classId: data.classId?.toString() || '',
                majorId: data.majorId?.toString() || '',
                admissionYear: data.admissionYear?.toString() || ''
            });
            setSelectedData(data);
        } else {
            // Reset form untuk mode add
            setFormData({
                name: '',
                nis: '',
                nisn: '',
                classId: '',
                majorId: '',
                birthDate: '',
                birthPlace: '',
                gender: '',
                address: '',
                phone: '',
                parentPhone: '',
                religion: '',
                motherName: '',
                fatherName: '',
                guardian: '',
                admissionYear: '',
                track: ''
            });
            setSelectedData(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
        setFormData({
            name: '',
            nis: '',
            nisn: '',
            classId: '',
            majorId: '',
            birthDate: '',
            birthPlace: '',
            gender: '',
            address: '',
            phone: '',
            parentPhone: '',
            religion: '',
            motherName: '',
            fatherName: '',
            guardian: '',
            admissionYear: '',
            track: ''
        });
    };

    // Handle submit
    const handleSubmit = async (formData: any) => {
        try {
            // Format data yang akan dikirim
            const formattedData = {
                name: formData.name,
                nis: formData.nis,
                nisn: formData.nisn,
                classId: parseInt(formData.classId),
                majorId: parseInt(formData.majorId),
                birthDate: new Date(formData.birthDate).toISOString(),
                birthPlace: formData.birthPlace,
                gender: formData.gender,
                address: formData.address,
                phone: formData.phone,
                parentPhone: formData.parentPhone,
                religion: formData.religion,
                motherName: formData.motherName,
                fatherName: formData.fatherName,
                guardian: formData.guardian,
                admissionYear: parseInt(formData.admissionYear),
                track: formData.track
            };
    
            if (modalMode === 'add') {
                await createStudent(formattedData);
                await showSuccessAlert('Berhasil', 'Data siswa berhasil ditambahkan');
            } else if (modalMode === "edit" && selectedData?.id) {
                await updateStudent(selectedData.id, formattedData);
                await showSuccessAlert('Berhasil', 'Data siswa berhasil diperbarui');
            }
            handleCloseModal();
            await fetchStudents();
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menyimpan data siswa');
        }
    };


    // Handle delete
    const handleDelete = async (id: number) => {
        const confirmed = await showConfirmDelete();
        if (confirmed) {
            try {
                await deleteStudent(id);
                await showSuccessAlert('Berhasil', 'Data siswa berhasil dihapus');
                await fetchStudents();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data siswa');
            }
        }
    };

    const filteredData = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.major?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.birthDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.birthPlace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.religion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.motherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.guardian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionYear?.toString().includes(searchTerm) ||
        student.track?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!isAuthorized) return null;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
        <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Siswa</h1>
                <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
            </div>


            {/* Filtering Bulanan */}
            <div className="mt-4 sm:mt-0">
                <div className=" bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
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

                    {/* 3 button*/}

                    <div className="flex space-x-2 mt-5 sm:mt-0">
                        {/* Button Tambah Data */}
                        <button
                            onClick={() => handleOpenModal('add')}
                            className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                        >
                            Tambah Data
                        </button>

                        {/* Button Import CSV */}
                        <button
                            onClick={() => console.log("Import CSV")}
                            className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                        >
                            Import Dari Excel
                        </button>

                        {/* Dropdown Export */}
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
                                    className={`w-4 h-4 ml-2 transform transition-transform ${dropdownOpen ? 'rotate-90' : 'rotate-0'
                                        }`}
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
                                        onClick={() => console.log("Export Excel")}
                                        className="block w-full text-left text-[var(--text-regular-color)] px-4 py-2 hover:bg-gray-100"
                                    >
                                        Export Excel
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>


                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg overflow-hidden">
                        <thead className="text-[var(--text-semi-bold-color)]">
                            <tr>
                            <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">NIS</th>
                                    <th className="py-2 px-4 border-b text-left">NISN</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Jurusan</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                                    <th className="py-2 px-4 border-b text-left">No. Telepon</th>
                                    <th className="py-2 px-4 border-b text-left">No. Telepon Ortu</th>
                                    <th className="py-2 px-4 border-b text-left">Agama</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Ibu</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Ayah</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Wali</th>
                                    <th className="py-2 px-4 border-b text-left">Tahun Diterima</th>
                                    <th className="py-2 px-4 border-b text-left">Jalur Masuk</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                                {currentEntries.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">{student.name}</td>
                                        <td className="py-2 px-4 border-b">{student.nis}</td>
                                        <td className="py-2 px-4 border-b">{student.nisn}</td>
                                        <td className="py-2 px-4 border-b">{student.class?.name || '-'}</td>
                                        <td className="py-2 px-4 border-b">{student.major?.name || '-'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <td className="py-2 px-4 border-b">{format(new Date(student.birthDate), 'dd MMMM yyyy', { locale: id })}</td>
                                        </td>
                                        <td className="py-2 px-4 border-b">{student.birthPlace}</td>
                                        <td className="py-2 px-4 border-b">{getGenderLabel(student.gender)}</td>
                                        <td className="py-2 px-4 border-b">{student.address}</td>
                                        <td className="py-2 px-4 border-b">
                                            {student.phone}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {student.parentPhone}
                                        </td>
                                        <td className="py-2 px-4 border-b">{getReligionLabel(student.religion)}</td>
                                        <td className="py-2 px-4 border-b">{student.motherName}</td>
                                        <td className="py-2 px-4 border-b">{student.fatherName}</td>
                                        <td className="py-2 px-4 border-b">{student.guardian || '-'}</td>
                                        <td className="py-2 px-4 border-b">{student.admissionYear}</td>
                                        <td className="py-2 px-4 border-b">{student.track || '-'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', student)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
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

                <div className="flex justify-between items-center mt-5">
                    <span className="text-xs sm:text-base">Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri</span>

                    <div className="flex items-center">
                        <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-[var(--main-color)]"
                        >
                            &lt;
                        </button>
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                                const pageNumber = currentPage + index;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`rounded-md px-3 py-1 ${currentPage === pageNumber ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
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

                <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Data Siswa' : 'Edit Data Siswa'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
            </div>
        </main>
    </div>
    );
}