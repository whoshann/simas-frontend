"use client";

import React, { useState } from "react";
import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import Image from 'next/image';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";


export default function StudentAffairsStudentDataPage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'Student' dan 'SuperAdmin'
        roleMiddleware(["StudentAffairs", "SuperAdmin"]);
        fetchData();
    }, []);
    const [user, setUser] = useState<any>({});
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const token = Cookies.get("token");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const data = [
        {
            no: 1,
            name: "Ahmad Rizky",
            classSchool: "10",
            major: "IPA 1",
            nis: "2024001",
            nisn: "1234567890",
            gender: "Laki-laki",
            birthDate: "15/03/2008",
            birthPlace: "Jakarta",
            address: "Jl. Mawar No. 10, Jakarta Selatan",
            phone: "081234567890",
            parentPhone: "081234567891",
            religion: "Islam",
            motherName: "Siti Aminah",
            fatherName: "Budi Santoso",
            guardian: "Haji Slamet"
        },
        {
            no: 2,
            name: "Siti Nurhaliza",
            classSchool: "11",
            major: "IPS 2",
            nis: "2024002",
            nisn: "1234567891",
            gender: "Perempuan",
            birthDate: "22/05/2007",
            birthPlace: "Bandung",
            address: "Jl. Melati No. 15, Bandung",
            phone: "081234567892",
            parentPhone: "081234567893",
            religion: "Islam",
            motherName: "Nur Aini",
            fatherName: "Ahmad Yani",
            guardian: null
        },
        {
            no: 3,
            name: "Michael Wijaya",
            classSchool: "12",
            major: "IPA 3",
            nis: "2024003",
            nisn: "1234567892",
            gender: "Laki-laki",
            birthDate: "10/08/2006",
            birthPlace: "Surabaya",
            address: "Jl. Anggrek No. 20, Surabaya",
            phone: "081234567894",
            parentPhone: "081234567895",
            religion: "Kristen",
            motherName: "Linda Wijaya",
            fatherName: "Robert Wijaya",
            guardian: "Tante Maria"
        },
        {
            no: 4,
            name: "Putri Rahayu",
            classSchool: "10",
            major: "IPS 1",
            nis: "2024004",
            nisn: "1234567893",
            gender: "Perempuan",
            birthDate: "05/12/2008",
            birthPlace: "Yogyakarta",
            address: "Jl. Kamboja No. 25, Yogyakarta",
            phone: "081234567896",
            parentPhone: "081234567897",
            religion: "Islam",
            motherName: "Sri Rahayu",
            fatherName: "Bambang Sutejo",
            guardian: null
        },
        {
            no: 5,
            name: "David Chen",
            classSchool: "11",
            major: "IPA 2",
            nis: "2024005",
            nisn: "1234567894",
            gender: "Laki-laki",
            birthDate: "18/09/2007",
            birthPlace: "Medan",
            address: "Jl. Dahlia No. 30, Medan",
            phone: "081234567898",
            parentPhone: "081234567899",
            religion: "Buddha",
            motherName: "Lily Chen",
            fatherName: "Jimmy Chen",
            guardian: "Paman Alex"
        },
        {
            no: 6,
            name: "Anisa Fitriani",
            classSchool: "12",
            major: "IPS 3",
            nis: "2024006",
            nisn: "1234567895",
            gender: "Perempuan",
            birthDate: "25/04/2006",
            birthPlace: "Semarang",
            address: "Jl. Kenanga No. 35, Semarang",
            phone: "081234567900",
            parentPhone: "081234567901",
            religion: "Islam",
            motherName: "Fatimah",
            fatherName: "Abdul Rahman",
            guardian: null
        },
        {
            no: 7,
            name: "Budi Prakoso",
            classSchool: "10",
            major: "IPA 1",
            nis: "2024007",
            nisn: "1234567896",
            gender: "Laki-laki",
            birthDate: "30/11/2008",
            birthPlace: "Malang",
            address: "Jl. Tulip No. 40, Malang",
            phone: "081234567902",
            parentPhone: "081234567903",
            religion: "Islam",
            motherName: "Suryani",
            fatherName: "Hendra Prakoso",
            guardian: "Kakek Suryo"
        },
        {
            no: 8,
            name: "Grace Patricia",
            classSchool: "11",
            major: "IPS 2",
            nis: "2024008",
            nisn: "1234567897",
            gender: "Perempuan",
            birthDate: "12/06/2007",
            birthPlace: "Manado",
            address: "Jl. Bougenville No. 45, Manado",
            phone: "081234567904",
            parentPhone: "081234567905",
            religion: "Kristen",
            motherName: "Sarah Patricia",
            fatherName: "John Patricia",
            guardian: null
        },
        {
            no: 9,
            name: "Reza Mahendra",
            classSchool: "12",
            major: "IPA 3",
            nis: "2024009",
            nisn: "1234567898",
            gender: "Laki-laki",
            birthDate: "08/02/2006",
            birthPlace: "Palembang",
            address: "Jl. Teratai No. 50, Palembang",
            phone: "081234567906",
            parentPhone: "081234567907",
            religion: "Islam",
            motherName: "Dewi Sartika",
            fatherName: "Agus Mahendra",
            guardian: "Bibi Rina"
        },
        {
            no: 10,
            name: "Maya Indah",
            classSchool: "10",
            major: "IPS 1",
            nis: "2024010",
            nisn: "1234567899",
            gender: "Perempuan",
            birthDate: "20/07/2008",
            birthPlace: "Makassar",
            address: "Jl. Flamboyan No. 55, Makassar",
            phone: "081234567908",
            parentPhone: "081234567909",
            religion: "Islam",
            motherName: "Ratna Sari",
            fatherName: "Dedi Kusuma",
            guardian: null
        }
    ];

    // Search item tabel
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.classSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.birthDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.birthPlace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.parentPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.religion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.guardian && item.guardian.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    const fetchData = async () => {
        try {
            // Set default Authorization header dengan Bearer token
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Fetch data user dari endpoint API
            const response = await axios.get("http://localhost:3333/student");
            setUser(response.data); // Simpan data user ke dalam state
        } catch (err: any) {
            console.error("Error saat fetching data:", err);
            setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
        } finally {
            setLoading(false); // Set loading selesai
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

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg overflow-hidden">
                            <thead className="text-[var(--text-semi-bold-color)]">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Nama</th>
                                    <th className="py-2 px-4 border-b text-left">Kelas</th>
                                    <th className="py-2 px-4 border-b text-left">Jurusan</th>
                                    <th className="py-2 px-4 border-b text-left">Nis</th>
                                    <th className="py-2 px-4 border-b text-left">Nisn</th>
                                    <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                                    <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                                    <th className="py-2 px-4 border-b text-left">Nomor</th>
                                    <th className="py-2 px-4 border-b text-left">Nomor Orangtua</th>
                                    <th className="py-2 px-4 border-b text-left">Agama</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Ibu</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Ayah</th>
                                    <th className="py-2 px-4 border-b text-left">Wali</th>
                                    <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item) => (
                                    <tr key={item.no} className="hover:bg-gray-100 text-[var(--text-regular-color)] ">
                                        <td className="py-2 px-4 border-b">{item.no}</td>
                                        <td className="py-2 px-4 border-b">{item.name}</td>
                                        <td className="py-2 px-4 border-b">{item.classSchool}</td>
                                        <td className="py-2 px-4 border-b">{item.major}</td>
                                        <td className="py-2 px-4 border-b">{item.nis}</td>
                                        <td className="py-2 px-4 border-b">{item.nisn}</td>
                                        <td className="py-2 px-4 border-b">{item.gender}</td>
                                        <td className="py-2 px-4 border-b">{item.birthDate}</td>
                                        <td className="py-2 px-4 border-b">{item.birthPlace}</td>
                                        <td className="py-2 px-4 border-b">{item.address}</td>
                                        <td className="py-2 px-4 border-b">{item.phone}</td>
                                        <td className="py-2 px-4 border-b">{item.parentPhone}</td>
                                        <td className="py-2 px-4 border-b">{item.religion}</td>
                                        <td className="py-2 px-4 border-b">{item.motherName}</td>
                                        <td className="py-2 px-4 border-b">{item.fatherName}</td>
                                        <td className="py-2 px-4 border-b">{item.guardian || '-'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"

                                                >
                                                    <i className="bx bxs-edit text-lg"></i>
                                                </button>

                                                {/* Delete Button */}
                                                <button
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
        </div>
    );
}
