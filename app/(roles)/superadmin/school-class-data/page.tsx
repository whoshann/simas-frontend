"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useSchoolClasses } from "@/app/hooks/useSchoolClassData";
import { useMajors } from "@/app/hooks/useMajorData";
import { useTeachers } from "@/app/hooks/useTeacher";
import { Grade } from "@/app/utils/enums";
import FormModal from "@/app/components/DataTable/FormModal";
import { SchoolClass } from "@/app/api/school-class/types";
import { useUser } from "@/app/hooks/useUser";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from '@/app/utils/sweetAlert';

export default function SuperAdminSchoolClassDataPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<Partial<SchoolClass>>({
        name: '',
        code: '',
        grade: Grade.X,
        majorId: undefined,
        homeroomTeacherId: undefined
    });

    // Hooks
    const { schoolClasses, loading, error, fetchSchoolClasses, createSchoolClass, updateSchoolClass, deleteSchoolClass } = useSchoolClasses();
    const { majors, fetchMajors } = useMajors();
    const { teachers, fetchTeachers } = useTeachers();
    const { user } = useUser();

    // Form fields configuration
    const formFields = [
        {
            name: 'name',
            label: 'Nama Kelas',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan nama kelas'
        },
        {
            name: 'code',
            label: 'Kode Kelas',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan kode kelas'
        },
        {
            name: 'grade',
            label: 'Tingkat',
            type: 'select' as const,
            required: true,
            options: [
                { value: Grade.X, label: 'X' },
                { value: Grade.XI, label: 'XI' },
                { value: Grade.XII, label: 'XII' }
            ]
        },
        {
            name: 'majorId',
            label: 'Jurusan',
            type: 'select' as const,
            required: true,
            options: majors.map(major => ({
                value: major.id,
                label: major.name
            }))
        },
        {
            name: 'homeroomTeacherId',
            label: 'Wali Kelas',
            type: 'select' as const,
            required: true,
            options: teachers.map(teacher => ({
                value: teacher.id,
                label: teacher.name
            }))
        }
    ];

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                await Promise.all([
                    fetchSchoolClasses(),
                    fetchMajors(),
                    fetchTeachers()
                ]);
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    const handleOpenModal = (mode: 'add' | 'edit', data?: SchoolClass) => {
        setModalMode(mode);
        if (mode === 'edit' && data) {
            setFormData({
                ...data,
                majorId: data.majorId,
                homeroomTeacherId: data.homeroomTeacherId
            });
        } else {
            setFormData({
                name: '',
                code: '',
                grade: Grade.X,
                majorId: majors[0]?.id,
                homeroomTeacherId: teachers[0]?.id
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            code: '',
            grade: Grade.X,
            majorId: undefined,
            homeroomTeacherId: undefined
        });
    };

    const handleSubmit = async (submittedData: Partial<SchoolClass>) => {
        try {
            const dataToSubmit = {
                name: submittedData.name!,
                code: submittedData.code!,
                grade: submittedData.grade!,
                majorId: Number(submittedData.majorId),
                homeroomTeacherId: Number(submittedData.homeroomTeacherId)
            };

            if (modalMode === 'add') {
                const response = await createSchoolClass(dataToSubmit);
                console.log('Success create school class:', response);
                await showSuccessAlert('Berhasil', 'Kelas berhasil ditambahkan');
            } else {
                const response = await updateSchoolClass(formData.id!, dataToSubmit);
                console.log('Success update school class:', response);
                await showSuccessAlert('Berhasil', 'Kelas berhasil diperbarui');
            }
            handleCloseModal();
            await fetchSchoolClasses();
        } catch (error) {
            console.error('Error submitting form:', error);
            await showErrorAlert('Error', 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Kelas',
            'Apakah Anda yakin ingin menghapus kelas ini?'
        );

        if (isConfirmed) {
            try {
                const response = await deleteSchoolClass(id);
                console.log('Success delete school class:', response);
                await showSuccessAlert('Berhasil', 'Kelas berhasil dihapus');
                await fetchSchoolClasses();
            } catch (error) {
                console.error('Error deleting class:', error);
                await showErrorAlert('Error', 'Gagal menghapus kelas');
            }
        }
    };

    // Filtering logic
    const filteredData = schoolClasses.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grade.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.major.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.homeroomTeacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    if (!isAuthorized) {
        return null;
    }

    if (loading) {
        return <LoadingSpinner />;
    }


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Kelas</h1>
                    <p className="text-sm text-gray-600">Halo {user?.username || 'User'}, selamat datang kembali</p>
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
                                Tambah Kelas
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
                                    <th className="py-2 px-4 border-b text-left">Nama Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Kode Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Tingkat</th>
                                    <th className="py-2 px-4 border-b text-left">Jurusan</th>
                                    <th className="py-2 px-4 border-b text-left">Wali Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.code}</td>
                                        <td className="py-2 px-4 border-b">
                                            {item.grade === Grade.X ? "X" :
                                                item.grade === Grade.XI ? "XI" : "XII"}
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.major.code}</td>
                                        <td className="py-2 px-4 border-b">{item.homeroomTeacher.name}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', item)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id!)}
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
                </div>
            </main>
            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                title={modalMode === 'add' ? 'Tambah Kelas' : 'Edit Kelas'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}