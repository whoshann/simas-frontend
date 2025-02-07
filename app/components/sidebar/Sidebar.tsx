"use client"

import React, { useState } from 'react';
import Cookies from "js-cookie";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: number;
    name: string;
    role: string;
}


const Sidebar: React.FC = () => {

    const [role, setRole] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpenKesiswaan, setIsDropdownOpenKesiswaan] = useState(false);
    const [isDropdownOpenFinanceStudent, setIsDropdownOpenFinanceStudent] = useState(false);
    const [isDropdownOpenFinance, setIsDropdownOpenFinance] = useState(false);
    const [isDropdownOpenFasilitas, setIsDropdownOpenFasilitas] = useState(false);
    const [isDropdownOpenPengelolaBarang, setIsDropdownOpenPengelolaBarang] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>(() => {

        // Mengambil activeMenu dari localStorage saat inisialisasi
        if (typeof window !== 'undefined') {
            const storedMenu = localStorage.getItem('activeMenu');
            return storedMenu || 'Beranda'; // Default ke 'Beranda' jika tidak ada
        }
        return 'Beranda';
    });


    useEffect(() => {

        const token = Cookies.get("token");
        setIsLoggedIn(!!token);

        const activeMenuName = localStorage.getItem('activeMenu');

        if (token && !activeMenuName) {
            setActiveMenu('Beranda');
            localStorage.setItem('activeMenu', 'Beranda');
        }

        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token); // Menggunakan jwtDecode
                setRole(decoded.role);
                // console.log("Role set to:", decoded.role);
            } catch (error) {
                // console.error("Error decoding token:", error);
            }
        }

        setIsLoading(false);

        // Cek apakah active menu adalah bagian dari submenu Kesiswaan
        if (['Absensi', 'Pelanggaran', 'Achievement', 'Klaim Asuransi', "Surat Dispensasi"].includes(activeMenuName || '')) {
            setIsDropdownOpenKesiswaan(true);
        }

        // Cek apakah active menu adalah bagian dari submenu Fasilitas
        if (['Data Fasilitas', 'Data Barang', 'Data Ruang'].includes(activeMenuName || '')) {
            setIsDropdownOpenFasilitas(true);
        }

        // Cek apakah active menu adalah bagian dari submenu Pengelolaan Barang
        if (['Barang Masuk', 'Peminjaman Barang', 'Inventaris', 'Pengajuan Barang'].includes(activeMenuName || '')) {
            setIsDropdownOpenPengelolaBarang(true);
        }
        // Cek apakah active menu adalah bagian dari submenu Keuangan
        if (['Pengeluaran', 'Pemasukan', 'Keuangan Bulanan'].includes(activeMenuName || '')) {
            setIsDropdownOpenFinance(true);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // Fungsi untuk mengatur sidebar berdasarkan ukuran jendela
    const handleResize = () => {
        if (window.innerWidth < 768) { // md breakpoint
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    };


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar
    };

    const toggleDropdownKesiswaan = () => {
        setIsDropdownOpenKesiswaan(!isDropdownOpenKesiswaan);
        if (!isDropdownOpenKesiswaan) {
            setActiveMenu('Kesiswaan');
        }
    };

    const toggleDropdownFasilitas = () => {
        setIsDropdownOpenFasilitas(!isDropdownOpenFasilitas);
        setIsDropdownOpenKesiswaan(false); // Tutup dropdown Kesiswaan
        setIsDropdownOpenPengelolaBarang(false);
        if (!isDropdownOpenFasilitas) {
            setActiveMenu('Fasilitas Sekolah');
        }
    };

    const toggleDropdownFinance = () => {
        setIsDropdownOpenFinance(!isDropdownOpenFinance);
        if (!isDropdownOpenFinanceStudent) {
            setActiveMenu('Keuangan Sekolah');
        }
    };

    const toggleDropdownPengelolaBarang = () => {
        setIsDropdownOpenPengelolaBarang(!isDropdownOpenPengelolaBarang);
        setIsDropdownOpenFasilitas(false); // Tutup dropdown lain
        if (!isDropdownOpenFinanceStudent) {
            setActiveMenu('Pengelola Barang');
        }
    };

    // Fungsi untuk mengatur active menu
    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        localStorage.setItem('activeMenu', menu);
        setIsDropdownOpenKesiswaan(false);
        setIsDropdownOpenFasilitas(false);
        setIsDropdownOpenFinance(false);
        setIsDropdownOpenPengelolaBarang(false);
    };

    const handleSubMenuClick = (submenu: string) => {
        setActiveMenu(submenu);
        localStorage.setItem('activeMenu', submenu);
        // Tidak menutup dropdown saat submenu diklik
    };

    // Tambahkan kondisi loading
    if (isLoading) {
        return null;
    }

    return (
        (<div>

            {/* Tombol Hamburger di luar sidebar */}
            <div className={`h-screen bg-white w-16 z-40 transition-all duration-300 ${isSidebarOpen ? 'hidden' : 'block'}`}>
                <button
                    onClick={toggleSidebar}
                    className="w-full pt-4 pb-2 px-4 text-gray-600 focus:outline-none"
                >
                    <i className='bx bx-menu text-xl'></i>
                </button>
            </div>

            <aside className={`bg-white w-64 h-screen space-y-6 py-7 px-4 z-1 fixed md:sticky inset-y-0 left-0 transition duration-300 ease-in-out ${isSidebarOpen ? 'block' : 'hidden'}`}>

                {/* Sidebar Title */}
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-[var(--text-semi-bold-color)] text-3xl font-semibold">Lorem</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-600 mt-2 focus:outline-none"
                    >
                        <i className='bx bx-x text-2xl'></i>
                    </button>
                </div>

                {/* Start Sidebar menu navigation */}
                <nav>
                    <a
                        href={
                            role === "StudentAffairs" ? "/student-affairs" :
                                role === "Student" ? "/student" :
                                    role === "Teacher" ? "/teacher" :
                                        role === "Facilities" ? "/facilities" :
                                            role === "Finance" ? "/finance" :
                                                role === "SuperAdmin" ? "/superadmin" :
                                                    ""
                        }
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Beranda' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Beranda')}
                    >
                        <i className='bx bxs-dashboard mr-2 font-medium'></i> {/* Ikon untuk Beranda */}
                        Beranda
                    </a>


                    {/*Start Role Student and Teacher menu */}
                    {(role === "Student" || !isLoggedIn) && (
                        <div>
                            <div>
                                <button
                                    className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${isDropdownOpenKesiswaan || ['Absensi', 'Pelanggaran', 'Achievement', 'Klaim Asuransi'].includes(activeMenu)
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={toggleDropdownKesiswaan}
                                >
                                    <i className='bx bxs-book mr-3'></i>
                                    <a href="#" className='mr-14 font-medium'> Kesiswaan</a>
                                    <svg
                                        className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpenKesiswaan ? 'rotate' : ''
                                            } ${isDropdownOpenKesiswaan || ['Absensi', 'Pelanggaran', 'Achievement', 'Klaim Asuransi'].includes(activeMenu)
                                                ? 'text-white'
                                                : 'text-[var(--text-thin-color)]'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className={` ${isDropdownOpenKesiswaan ? '' : 'hidden'}`}>
                                    <a
                                        href={
                                            role === "Student" ? "/student/student-affairs/absence" :
                                                "/login"
                                        }
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Absensi' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Absensi')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Absensi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Absensi
                                    </a>

                                    <a
                                        href={
                                            role === "Student" ? "/student/student-affairs/violations" :
                                                "/login"
                                        }
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pelanggaran' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Pelanggaran')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pelanggaran' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Pelanggaran
                                    </a>

                                    <a
                                        href={role === "Student" ? "/student/student-affairs/achievement" : "/login"}
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Achievement' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Achievement')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Achievement' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Prestasi
                                    </a>


                                    <a
                                        href={role === "Student" ? "/student/student-affairs/claim-insurance" : "/login"}
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Klaim Asuransi' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Klaim Asuransi')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Klaim Asuransi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Klaim Asuransi
                                    </a>

                                    <a
                                        href={role === "Student" ? "/student/student-affairs/dispensation-letter" : "/login"}
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Surat Dispensasi' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Surat Dispensasi')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Surat Dispensasi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Surat Dispensasi
                                    </a>
                                </div>
                            </div>

                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Humas' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Humas')}
                            >
                                <i className='bx bxs-contact mr-2 font-medium'></i> {/* Ikon untuk Humas */}
                                Humas
                            </a>
                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Tata Usaha' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Tata Usaha')}
                            >
                                <i className='bx bxs-archive mr-2 font-medium'></i> {/* Ikon untuk Tata Usaha */}
                                Tata Usaha
                            </a>

                            <a
                                href={
                                    role === "Student" ? "/student/finance/payment-status" :
                                        "/login"
                                }
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Keuangan' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Keuangan')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i>
                                Keuangan
                            </a>

                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kurikulum' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Kurikulum')}
                            >
                                <i className='bx bxs-report mr-2 font-medium'></i>
                                Kurikulum
                            </a>

                            <a
                                href={role === "Student" ? "/student/facilities-management/borrowing-goods" :
                                    "/login"
                                }
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Facilities' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Facilities')}
                            >
                                <i className='bx bxs-chalkboard mr-2 font-medium'></i> {/* Ikon untuk Sarpras */}
                                Sarpras
                            </a>

                        </div>
                    )}

                    {/* Start Role Teacher Sidebar Menu */}

                    {role === "Teacher" && (
                        <div>
                            <a
                                href="/teacher/finance/budget-proposal"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Budget Proposal' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Budget Proposal')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Usulan Anggaran */}
                                Usulan Anggaran RAB
                            </a>
                            <a
                                href="/teacher/facilities-management/borrowing-goods"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Borrowing Goods' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Borrowing Goods')}
                            >
                                <i className='bx bxs-hdd mr-2 font-medium'></i> {/* Ikon untuk Peminjaman Barang */}
                                Peminjaman Barang
                            </a>
                            <a
                                href="/teacher/facilities-management/request-goods"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Request Goods' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Request Goods')}
                            >
                                <i className='bx bxs-hdd mr-2 font-medium'></i> {/* Ikon untuk Peminjaman Barang */}
                                Pengajuan Barang
                            </a>
                        </div>
                    )}

                    {/* End Role Teacher Sidebar Menu */}

                    {/* Start Role Student Affairs Sidebar Menu */}
                    {role === "StudentAffairs" && (
                        <div>
                            <a
                                href="/student-affairs/student-absence"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Student Absence' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Student Absence')}
                            >
                                <i className='bx bxs-calendar mr-2 font-medium'></i> {/* Ikon untuk Absensi Siswa */}
                                Absensi Siswa
                            </a>
                            <a
                                href="/student-affairs/student-achievement"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Student Achievement' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Student Achievement')}
                            >
                                <i className='bx bxs-trophy mr-2 font-medium'></i> {/* Ikon untuk Student Achievement */}
                                Prestasi Siswa
                            </a>
                            <a
                                href="/student-affairs/student-violations"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Student Violation' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Student Violation')}
                            >
                                <i className='bx bxs-error-alt mr-2 font-medium'></i> {/* Ikon untuk Pelanggaran Siswa */}
                                Pelanggaran Siswa
                            </a>
                            <a
                                href="/student-affairs/dispensation-letter"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Dispense Letter' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Dispense Letter')}
                            >
                                <i className='bx bxs-envelope mr-2 font-medium'></i> {/* Ikon untuk Surat Dispen */}
                                Surat Dispen
                            </a>
                            <a
                                href="/student-affairs/student-claim-insurance"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Insurance Claim' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Insurance Claim')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Klaim Asuransi */}
                                Klaim Asuransi
                            </a>
                            <a
                                href="/student-affairs/news-information"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'News Information' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('News Information')}
                            >
                                <i className='bx bxs-news mr-2 font-medium'></i> {/* Ikon untuk Informasi Berita */}
                                Informasi Berita
                            </a>
                            {/* <a
                                href="/student-affairs/student-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Student Data' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Student Data')}
                            >
                                <i className='bx bxs-graduation mr-2 font-medium'></i>
                                Data Siswa
                            </a>
                            <a
                                href="/student-affairs/teacher-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Teacher Data' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Teacher Data')}
                            >
                                <i className='bx bxs-user-badge mr-2 font-medium'></i>
                                Data Guru
                            </a> */}
                            <a
                                href="/student-affairs/budget-proposal"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Student Affairs Finance' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Student Affairs Finance')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Student Affairs Finance */}
                                Usulan Anggaran RAB
                            </a>
                        </div>
                    )}


                    {/* Start Role Facilities Sidebar Menu */}
                    {role === "Facilities" && (
                        <div>
                            <a
                                href="/facilities/repairs"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Facilities' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Facilities')}
                            >
                                <i className='bx bxs-chalkboard mr-2 font-medium'></i>
                                Perbaikan
                            </a>
                            <div>
                                <button
                                    className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${isDropdownOpenFasilitas || ['Data Fasilitas', 'Data Ruang'].includes(activeMenu)
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={toggleDropdownFasilitas}
                                >
                                    <i className='bx bxs-book mr-3'></i>
                                    <a href="#" className='font-medium'> Fasilitas Sekolah</a>
                                    <svg
                                        className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpenFasilitas ? 'rotate' : ''}  ${isDropdownOpenFasilitas || ['Data Fasilitas', 'Data Ruang'].includes(activeMenu)
                                            ? 'text-white'
                                            : 'text-[var(--text-thin-color)]'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className={` ${isDropdownOpenFasilitas ? '' : 'hidden'}`}>
                                    <a
                                        href="/facilities/school-facilities/facility-data"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Data Fasilitas' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Data Fasilitas')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Data Fasilitas' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Data Fasilitas
                                    </a>
                                    <a
                                        href="/facilities/school-facilities/room-data"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Data Ruang' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Data Ruang')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Data Ruang' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Data Ruang
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button
                                    className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${isDropdownOpenPengelolaBarang || ['Barang Masuk', 'Barang Keluar', 'Inventaris', 'Pengajuan Barang'].includes(activeMenu)
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={toggleDropdownPengelolaBarang}
                                >
                                    <i className='bx bxs-book mr-3'></i>
                                    <a href="#" className='font-medium'>Kelola Barang</a>
                                    <svg
                                        className={`h-4 w-4 ml-9 transition-transform duration-200 ${isDropdownOpenPengelolaBarang ? 'rotate' : ''}${isDropdownOpenPengelolaBarang || ['Barang Masuk', 'Barang Keluar', 'Inventaris', 'Pengajuan Barang'].includes(activeMenu)
                                            ? 'text-white'
                                            : 'text-[var(--text-thin-color)]'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className={` ${isDropdownOpenPengelolaBarang ? '' : 'hidden'}`}>
                                    <a
                                        href="/facilities/goods-management/incoming-goods"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Barang Masuk' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Barang Masuk')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Barang Masuk' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Barang Masuk
                                    </a>
                                    <a
                                        href="/facilities/goods-management/outgoing-goods"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Peminjaman Barang' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Peminjaman Barang')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Peminjaman Barang' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Peminjaman Barang
                                    </a>
                                    <a
                                        href="/facilities/goods-management/inventory"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Inventaris' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Inventaris')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Inventaris' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Inventaris
                                    </a>
                                    <a
                                        href="/facilities/goods-management/item-request"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pengajuan Barang' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Pengajuan Barang')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pengajuan Barang' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Pengajuan barang
                                    </a>

                                </div>
                            </div>
                            <a
                                href="/facilities/finance/budget-proposal"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Keuangan' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Keuangan')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Keuangan */}
                                Usulan Anggaran RAB
                            </a>
                        </div>
                    )}
                    {/* End Role Facilities Sidebar Menu */}


                    {/* Start Role Finance sidebar menu */}
                    {role === "Finance" && ( //bersifat sementara
                        <div>
                            <a
                                href="/finance/budget-management"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Manajemen Anggaran' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Manajemen Anggaran')}
                            >
                                <i className='bx bxs-chalkboard mr-2 font-medium'></i>
                                Manajemen Anggaran
                            </a>
                            <div>
                                <button
                                    className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${isDropdownOpenFinance || ['Pengeluaran', 'Pemasukan', 'Keuangan Bulanan'].includes(activeMenu)
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={toggleDropdownFinance}
                                >
                                    <i className='bx bxs-book mr-3'></i>
                                    <a href="#" className='font-medium'> Keuangan Sekolah</a>
                                    <svg
                                        className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpenFinance ? 'rotate' : ''}  ${isDropdownOpenFinance || ['Keuangan Utama', 'Pengeluaran', 'Pemasukan', 'Keuangan Bulanan'].includes(activeMenu)
                                            ? 'text-white'
                                            : 'text-[var(--text-thin-color)]'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className={` ${isDropdownOpenFinance ? '' : 'hidden'}`}>
                                    <a
                                        href="/finance/finance/monthly-finance"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Keuangan Bulanan' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Keuangan Bulanan')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Keuangan Bulanan' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Keuangan Bulanan
                                    </a>
                                    <a
                                        href="/finance/finance/expense"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pengeluaran' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Pengeluaran')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pengeluaran' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Pengeluaran
                                    </a>
                                    <a
                                        href="/finance/finance/income"
                                        className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pemasukan' ? 'text-blue-900' : ''}`}
                                        onClick={() => handleSubMenuClick('Pemasukan')}
                                    >
                                        <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pemasukan' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                        Pemasukan
                                    </a>
                                </div>
                            </div>
                            <a
                                href="/finance/spp"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'SPP' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('SPP')}
                            >
                                <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk SPP */}
                                SPP
                            </a>
                        </div>
                    )}

                    {/* End Role Finance sidebar menu */}

                    {/* Start Role Super Admin */}

                    {role === "SuperAdmin" && (
                        <div>
                            <a
                                href="/superadmin/student-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Data Siswa' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Data Siswa')}
                            >
                                <i className='bx bxs-graduation mr-2 font-medium'></i>
                                Data Siswa
                            </a>
                            <a
                                href="/superadmin/teacher-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Data Guru' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Data Guru')}
                            >
                                <i className='bx bxs-user-rectangle mr-2 font-medium'></i>
                                Data Guru
                            </a>
                            <a
                                href="/superadmin/position-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Posisi Jabatan' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Posisi Jabatan')}
                            >
                                <i className='bx bxs-user-detail mr-2 font-medium'></i>
                                Posisi Jabatan
                            </a>
                            <a
                                href="/superadmin/employee-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Data Karyawan' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Data Karyawan')}
                            >
                                <i className='bx bxs-id-card mr-2 font-medium'></i>
                                Data Karyawan
                            </a>

                            <a
                                href="/superadmin/subject-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Mapel' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Mapel')}
                            >
                                <i className='bx bxs-book mr-2 font-medium'></i>
                                Data Mapel
                            </a>
                            <a
                                href="/superadmin/school-class-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kelas' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Kelas')}
                            >
                                <i className='bx bxs-school mr-2 font-medium'></i>
                                Data Kelas
                            </a>
                            <a
                                href="/superadmin/major-data"
                                className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Jurusan' ? 'active' : ''}`}
                                onClick={() => handleMenuClick('Jurusan')}
                            >
                                <i className='bx bxs-chalkboard mr-2 font-medium'></i>
                                Data Jurusan
                            </a>
                        </div>
                    )}

                    {/* End Role Super Admin */}

                </nav>
                {/* End Sidebar menu navigation  */}

                {/* Login Button */}
                <a href={isLoggedIn ? "/user-profile" : "/login"} className="fixed bottom-5 left-2 right-2 px-3 w-5">
                    <button className="flex items-center justify-center w-52 py-3 rounded-xl border border-[var(--text-semi-bold-color)] bg-white text-[var(--text-semi-bold-color)] hover:opacity-90 transition">
                        <i className={`bx ${isLoggedIn ? 'bx-user' : 'bx-power-off'} mr-2 font-medium`}></i>
                        {isLoggedIn ? "Profile Anda" : "Login / Masuk"}
                    </button>
                </a>
            </aside>
        </div>)
    );
};

export default Sidebar;