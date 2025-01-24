"use client";

import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Image from 'next/image';
import { useStudents } from "@/app/hooks/useStudent";
import { Student } from "@/app/api/student/types";

export default function StudentDataPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { students, loading, error, fetchStudents } = useStudents();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["StudentAffairs"]);
                setIsAuthorized(true);
                await fetchStudents(); // Fetch data siswa
            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    const filteredData = students.filter(item =>
        Object.values(item).some(
            value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Data Siswa</h1>
                    <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
                </div>

                {/* Search */}
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
                                className="border rounded px-2 py-1"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <label className="ml-2">entri</label>
                        </div>
                        {/* 3 button*/}

                        <div className="flex space-x-2 mt-5 sm:mt-0">
                            {/* Button Tambah Data */}
                            <button
                                onClick={() => console.log("Tambah Data")}
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

                    {/* Table */}
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
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData
                                    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                                    .map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b">{student.name}</td>
                                            <td className="py-2 px-4 border-b">{student.nis}</td>
                                            <td className="py-2 px-4 border-b">{student.nisn}</td>
                                            <td className="py-2 px-4 border-b">{student.class?.name || '-'}</td>
                                            <td className="py-2 px-4 border-b">{student.major?.name || '-'}</td>
                                            <td className="py-2 px-4 border-b">{formatDate(student.birthDate)}</td>
                                            <td className="py-2 px-4 border-b">{student.birthPlace}</td>
                                            <td className="py-2 px-4 border-b">
                                                {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </td>
                                            <td className="py-2 px-4 border-b">{student.address}</td>
                                            <td className="py-2 px-4 border-b">{student.phone}</td>
                                            <td className="py-2 px-4 border-b">{student.parentPhone}</td>
                                            <td className="py-2 px-4 border-b">{student.religion}</td>
                                            <td className="py-2 px-4 border-b">{student.motherName}</td>
                                            <td className="py-2 px-4 border-b">{student.fatherName}</td>
                                            <td className="py-2 px-4 border-b">{student.guardian || '-'}</td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                        onClick={() => console.log("Edit", student.id)}
                                                    >
                                                        <i className="bx bxs-edit text-lg"></i>
                                                    </button>
                                                    <button
                                                        className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                                        onClick={() => console.log("Delete", student.id)}
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
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm">
                            Menampilkan {Math.min((currentPage - 1) * entriesPerPage + 1, filteredData.length)} hingga{' '}
                            {Math.min(currentPage * entriesPerPage, filteredData.length)} dari {filteredData.length} entri
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded-md text-[var(--main-color)]"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: Math.ceil(filteredData.length / entriesPerPage) }, (_, i) => i + 1)
                                .filter(pageNum =>
                                    pageNum === 1 ||
                                    pageNum === Math.ceil(filteredData.length / entriesPerPage) ||
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                )
                                .map((pageNum, index, array) => (
                                    <React.Fragment key={pageNum}>
                                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                                            <span className="px-2">...</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-md ${currentPage === pageNum
                                                ? 'bg-[var(--main-color)] text-white'
                                                : 'text-[var(--main-color)]'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    </React.Fragment>
                                ))}
                            <button
                                onClick={() => setCurrentPage(prev =>
                                    Math.min(prev + 1, Math.ceil(filteredData.length / entriesPerPage))
                                )}
                                disabled={currentPage === Math.ceil(filteredData.length / entriesPerPage)}
                                className="px-3 py-1  text-[var(--main-color)]"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}