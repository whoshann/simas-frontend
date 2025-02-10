"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useViolation } from "@/app/hooks/useViolationData";
import { useStudents } from "@/app/hooks/useStudent";
import { useViolationPoint } from "@/app/hooks/useViolationPointData";
import FormModal from "@/app/components/DataTable/FormModal";
import { showConfirmDelete, showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";
import { generateViolationReport } from '@/app/utils/pdfTemplates/violationReport/violationReport';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useUser } from "@/app/hooks/useUser";
import { exportToExcel, ExportConfigs } from '@/app/utils/exportToExcel';


export default function StudentAffairsViolationsPage() {
    // States
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedData, setSelectedData] = useState<any>(null);
    const [error, setError] = useState<string>("");

    // Custom Hooks
    const { violations, loading: violationLoading, fetchViolations, createViolation, updateViolation, deleteViolation } = useViolation();
    const { students, fetchStudents } = useStudents();
    const { violationPoints, fetchViolationPoints } = useViolationPoint();
    const { user } = useUser();

    // Initial form data
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        violationPointId: '',
        punishment: '',
        date: ''
    });

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs", "SuperAdmin"]);
                await Promise.all([
                    fetchViolations(),
                    fetchStudents(),
                    fetchViolationPoints()
                ]);
                console.log('Violations data:', violations);
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error:", error);
                setError("Terjadi kesalahan saat memuat halaman");
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Form fields configuration
    const formFields = [
        {
            name: 'studentId',
            label: 'Nama Siswa',
            type: 'select' as const,
            required: true,
            options: students.map(student => ({
                value: student.id,
                label: `${student.name}`
            }))
        },
        {
            name: 'name',
            label: 'Pelanggaran',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Masukkan Deskripsi Pelanggaran',
            rows: 3
        },
        {
            name: 'violationPointId',
            label: 'Kategori Pelanggaran',
            type: 'select' as const,
            options: violationPoints.map(point => ({
                value: point.id,
                label: `${point.name} (${point.points} poin)`
            })),
            required: true
        },
        {
            name: 'punishment',
            label: 'Hukuman',
            type: 'text' as const,
            required: true,
            placeholder: 'Masukkan hukuman'
        },
        {
            name: 'date',
            label: 'Tanggal',
            type: 'date' as const,
            required: true
        }
    ];

    const handleOpenModal = (mode: 'add' | 'edit', data?: any) => {
        setModalMode(mode);
        if (mode === 'edit' && data) {
            setFormData({
                studentId: data.studentId.toString(),
                name: data.name,
                violationPointId: data.violationPointId.toString(),
                punishment: data.punishment,
                date: format(new Date(data.date), 'yyyy-MM-dd')
            });
            setSelectedData(data);
        } else {
            setFormData({
                studentId: '',
                name: '',
                violationPointId: '',
                punishment: '',
                date: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
        setFormData({
            studentId: '',
            name: '',
            violationPointId: '',
            punishment: '',
            date: ''
        });
    };

    const handleSubmit = async (formData: any) => {
        try {
            const violationData = {
                studentId: parseInt(formData.studentId),
                violationPointId: parseInt(formData.violationPointId),
                name: formData.name,
                punishment: formData.punishment,
                date: formData.date
            };

            if (modalMode === 'add') {
                await createViolation(violationData);
                await showSuccessAlert('Berhasil', 'Data pelanggaran berhasil ditambahkan');
            } else {
                await updateViolation(selectedData.id, violationData);
                await showSuccessAlert('Berhasil', 'Data pelanggaran berhasil diperbarui');
            }
            handleCloseModal();
            await fetchViolations();
        } catch (error) {
            console.error('Error:', error);
            await showErrorAlert('Error', 'Gagal menyimpan data pelanggaran');
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Pelanggaran',
            'Apakah Anda yakin ingin menghapus data pelanggaran ini?'
        );

        if (isConfirmed) {
            try {
                await deleteViolation(id);
                await showSuccessAlert('Berhasil', 'Data pelanggaran berhasil dihapus');
                await fetchViolations();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert('Error', 'Gagal menghapus data pelanggaran');
            }
        }
    };

    const handleExportPDF = () => {
        try {
            // Menggunakan currentEntries (data yang tampil di tabel) bukan filteredData
            const doc = generateViolationReport(currentEntries);
            doc.save('laporan-pelanggaran.pdf');
            setDropdownOpen(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            showErrorAlert('Error', 'Gagal menghasilkan PDF');
        }
    };


    // fungsi untuk search
    const filteredData = violations.filter(item =>
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.violationPoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.punishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    // fungsi untuk pagination tabel
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleExport = () => {
        if (filteredData && filteredData.length > 0) {
            const formattedData = filteredData.map((item, index) => ({
                'No': index + 1,
                'Nama Siswa': item.student.name,
                'Kelas': item.student.class?.name || '-',
                'Pelanggaran': item.name,
                'Kategori': item.violationPoint.name,
                'Poin': item.violationPoint.points,
                'Hukuman': item.punishment,
                'Tanggal': format(new Date(item.date), 'dd MMMM yyyy', { locale: id }),
                'Tanggal Dibuat': item.createdAt ? format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: id }) : '-',
                'Terakhir Diupdate': item.updatedAt ? format(new Date(item.updatedAt), 'dd MMMM yyyy', { locale: id }) : '-'
            }));

            exportToExcel(formattedData, 'Data Pelanggaran Siswa');
        } else {
            console.error('Tidak ada data untuk diekspor');
        }
    };

    if (violationLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Point Pelanggaran Siswa</h1>
                    <p className="text-sm text-gray-600">Halo {user?.username}, selamat datang kembali</p>
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
                                            onClick={handleExportPDF}
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

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Pelanggaran</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Hukuman</th>
                                    <th className="py-2 px-4 border-b text-left">Point</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((violations, index) => (
                                    <tr key={violations.id} className="hover:bg-gray-100 text-[var(--text-regular-color)]">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{violations.student.name}</td>
                                        <td className="py-2 px-4 border-b">{students.find(student => student.id === violations.studentId)?.class.name || '-'}</td>
                                        <td className="py-2 px-4 border-b">{violations.name}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-3 py-1 rounded-full ${violations.violationPoint.name === 'Ringan'
                                                ? 'bg-[#0a97b028] text-[var(--third-color)]'
                                                : violations.violationPoint.name === 'Sedang'
                                                    ? 'bg-[#e88e1f29] text-[var(--second-color)]'
                                                    : 'bg-[#bd000025] text-[var(--fourth-color)]'
                                                }`}>
                                                {violations.violationPoint.name}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{violations.punishment}</td>
                                        <td className="py-2 px-4 border-b">{violations.violationPoint.points}</td>
                                        {/* <td className="py-2 px-4 border-b">
                                            <div className="w-16 h-16 overflow-hidden rounded">
                                                {violations.document ? (
                                                    <Image
                                                        src={violations.document}
                                                        alt="Bukti Surat"
                                                        className="w-full h-full object-cover"
                                                        width={256}
                                                        height={256}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </div>
                                        </td> */}
                                        <td className="py-2 px-4 border-b">  {format(new Date(violations.date), 'dd MMMM yyyy', { locale: id })}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', violations)}
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(violations.id)}
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
                                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                                    const pageNumber = currentPage + index;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`rounded-md px-3 py-1 ${currentPage === pageNumber
                                                ? 'bg-[var(--main-color)] text-white'
                                                : 'text-[var(--main-color)]'
                                                }`}
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
                title={modalMode === 'add' ? 'Tambah Data Pelanggaran' : 'Edit Data Pelanggaran'}
                mode={modalMode}
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                size="lg"
            />
        </div>
    );
}