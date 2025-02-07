

"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import FormModal from "@/app/components/DataTable/FormModal";
import axios from "axios";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { getUserIdFromToken } from "@/app/utils/tokenHelper";
import { useTeachers } from "@/app/hooks/useTeacher";
import { useSubjects } from "@/app/hooks/useSubject";
import { usePositions } from "@/app/hooks/usePositionData";
import { Gender, TeacherRole } from "@/app/utils/enums";
import { getGenderLabel, getTeacherRoleLabel } from "@/app/utils/enumHelpers";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function SuperAdminTeacherDataPage() {

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const token = Cookies.get("token");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { teachers, loading, error, fetchTeachers, createTeachers, updateTeachers, deleteTeachers } = useTeachers();
    const { subjects, fetchSubjects } = useSubjects();
    const { positions, fetchPositions } = usePositions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedData, setSelectedData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        nip: '',
        gender: '',
        birthDate: '',
        placeOfBirth: '',
        address: '',
        phone: '',
        lastEducation: '',
        lastEducationMajor: '',
        subjectId: '',
        positionId: '',
        role: '',
        picture: null
    });

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                await Promise.all([
                    fetchTeachers(),
                    fetchSubjects(),
                    fetchPositions()
                ]);
                const id = getUserIdFromToken();
                if (id) {
                    setUserId(id);
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    const formFields = [
        {
            name: 'name',
            label: 'Nama Lengkap',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama lengkap'
        },
        {
            name: 'nip',
            label: 'NIP',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan NIP'
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
            name: 'birthDate',
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
            name: 'address',
            label: 'Alamat',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan alamat lengkap',
            rows: 3
        },
        {
            name: 'phone',
            label: 'Nomor Telepon',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nomor telepon'
        },
        {
            name: 'lastEducation',
            label: 'Pendidikan Terakhir',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan pendidikan terakhir'
        },
        {
            name: 'lastEducationMajor',
            label: 'Jurusan Pendidikan Terakhir',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan jurusan'
        },
        {
            name: 'subjectId',
            label: 'Mata Pelajaran',
            type: 'select' as const,
            required: true,
            options: subjects.map(subject => ({
                value: subject.id.toString(),
                label: subject.name
            }))
        },
        {
            name: 'positionId',
            label: 'Posisi Jabatan',
            type: 'select' as const,
            required: true,
            options: positions.map(position => ({
                value: position.id.toString(),
                label: position.name
            }))
        },
        {
            name: 'role',
            label: 'Peran',
            type: 'select' as const,
            required: true,
            options: [
                { value: TeacherRole.Teacher, label: 'Guru' },
                { value: TeacherRole.HomeroomTeacher, label: 'Wali Kelas' }
            ]
        },
        {
            name: 'picture',
            label: 'Foto',
            type: 'file' as const,
            required: false,
            accept: 'image/*'
        }

    ];

    // Handler untuk membuka modal
    const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
        setModalMode(mode);

        // Hanya format tanggal jika mode edit dan data ada
        const formattedDate = (mode === 'edit' && data?.birthDate)
            ? new Date(data.birthDate).toISOString().split('T')[0]
            : '';

        if (mode === 'edit' && data) {
            setFormData({
                ...data,
                birthDate: formattedDate,
                name: data.name || '',
                nip: data.nip || '',
                gender: data.gender || '',
                placeOfBirth: data.placeOfBirth || '',
                address: data.address || '',
                phone: data.phone || '',
                lastEducation: data.lastEducation || '',
                lastEducationMajor: data.lastEducationMajor || '',
                subjectId: data.subject?.id?.toString() || '',
                positionId: data.position?.id?.toString() || '',
                role: data.role || '',
                picture: null
            });
            setSelectedData(data);
        } else {
            setFormData({
                name: '',
                nip: '',
                gender: '',
                birthDate: '',
                placeOfBirth: '',
                address: '',
                phone: '',
                lastEducation: '',
                lastEducationMajor: '',
                subjectId: '',
                positionId: '',
                role: '',
                picture: null
            });
        }
        setIsModalOpen(true);
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
        setFormData({
            name: '',
            nip: '',
            gender: '',
            birthDate: '',
            placeOfBirth: '',
            address: '',
            phone: '',
            lastEducation: '',
            lastEducationMajor: '',
            subjectId: '',
            positionId: '',
            role: '',
            picture: null
        });
    };

    // Handler untuk submit form
    const handleSubmit = async (formData: any) => {
        try {

            const formatData = {
                birthDate: new Date(formData.birthDate).toISOString(),
                name: formData.name,
                nip: formData.nip,
                gender: formData.gender,
                placeOfBirth: formData.placeOfBirth,
                address: formData.address,
                phone: formData.phone,
                lastEducation: formData.lastEducation,
                lastEducationMajor: formData.lastEducationMajor,
                role: formData.role,
                subjectId: parseInt(formData.subjectId),    // Tambahkan ini
                positionId: parseInt(formData.positionId),
                picture: formData.picture || null

            }

            if (modalMode === 'add') {
                // Tambahkan logika untuk create teacher
                await createTeachers(formatData);
                await showSuccessAlert('Berhasil', 'Data guru berhasil ditambahkan');
            } else if (modalMode === "edit" && selectedData?.id) {

                const { id, createdAt, updatedAt, ...validData } = formData;

                // Tambahkan logika untuk update teacher
                const response = await updateTeachers(selectedData.id, formatData);
                await showSuccessAlert('Berhasil', 'Data guru berhasil diperbarui');
            }
            handleCloseModal();
            await fetchTeachers();
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menyimpan data guru');
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Pelanggaran',
            'Apakah Anda yakin ingin menghapus data pelanggaran ini?'
        );

        if (isConfirmed) {
            try {
                await deleteTeachers(id);
                await showSuccessAlert('Berhasil', 'Data guru berhasil dihapus');
                await fetchTeachers();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data guru');
            }
        }
    };

    // Search item tabel
    const filteredData = teachers.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.birthDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.placeOfBirth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lastEducation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lastEducationMajor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
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
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Guru</h1>
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
                                    <th className="py-2 px-4 border-b text-left">Foto</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Nip</th>
                                    <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                                    <th className="py-2 px-4 border-b text-left">Nomor</th>
                                    <th className="py-2 px-4 border-b text-left">Pendidikan Terakhir</th>
                                    <th className="py-2 px-4 border-b text-left">Jurusan Pendidikan Terakhir</th>
                                    <th className="py-2 px-4 border-b text-left">Mapel Yang Diajarkan</th>
                                    <th className="py-2 px-4 border-b text-left">Posisi Jabatan</th>
                                    <th className="py-2 px-4 border-b text-left">Peran</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {item.picture ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/teacher/${item.picture.split('/').pop()}`}
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
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.nip}</td>
                                        <td className="py-2 px-4 border-b">{getGenderLabel(item.gender)}</td>
                                        <td className="py-2 px-4 border-b">{format(new Date(item.birthDate), 'dd MMMM yyyy', { locale: id })}</td>
                                        <td className="py-2 px-4 border-b">{item.placeOfBirth}</td>
                                        <td className="py-2 px-4 border-b">{item.address}</td>
                                        <td className="py-2 px-4 border-b">{item.phone}</td>
                                        <td className="py-2 px-4 border-b">{item.lastEducation}</td>
                                        <td className="py-2 px-4 border-b">{item.lastEducationMajor}</td>
                                        <td className="py-2 px-4 border-b">{item.subject.name}</td>
                                        <td className="py-2 px-4 border-b">{item.position.name}</td>
                                        <td className="py-2 px-4 border-b">{getTeacherRoleLabel(item.role)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleOpenModal('edit', item)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>

                                                {/* Delete Button */}
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
                        title={modalMode === 'add' ? 'Tambah Data Guru' : 'Edit Data Guru'}
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
