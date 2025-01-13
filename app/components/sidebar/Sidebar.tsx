"use client"

import React, { useState } from 'react';
import Cookies from "js-cookie";
import { useEffect } from "react";

const Sidebar: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpenKesiswaan, setIsDropdownOpenKesiswaan] = useState(false);
    const [isDropdownOpenFasilitas, setIsDropdownOpenFasilitas] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>('Beranda');

    useEffect(() => {
        // Ambil role dari cookies
        const token = Cookies.get("token");
        setIsLoggedIn(!!token);
        const userRole = Cookies.get("role");
        setRole(userRole || null);


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
        setIsDropdownOpenFasilitas(false); // Tutup dropdown Fasilitas 
        if (!isDropdownOpenKesiswaan) {
            setActiveMenu('Kesiswaan');
        }
    };

    const toggleDropdownFasilitas = () => {
        setIsDropdownOpenFasilitas(!isDropdownOpenFasilitas);
        setIsDropdownOpenKesiswaan(false); // Tutup dropdown Kesiswaan
        if (!isDropdownOpenFasilitas) {
            setActiveMenu('Fasilitas Sekolah');
        }
    };

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        setIsDropdownOpenKesiswaan(false); // Tutup dropdown Kesiswaan
        setIsDropdownOpenFasilitas(false); // Tutup dropdown Fasilitas Sekolah
    };

    const handleSubMenuClick = (submenu: string) => {
        setActiveMenu(submenu);
        // Do not close dropdown
    };

    return (
        (<div>
            {/* Tombol Hamburger di luar sidebar */}
            <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 text-gray-600 focus:outline-none">
                <i className={`bx ${isSidebarOpen ? 'bx-x' : 'bx-menu'}`}></i>
            </button>
            <aside className={`bg-white w-64 h-screen space-y-6 py-7 px-4 z-1 fixed md:sticky inset-y-0 left-0 transition duration-300 ease-in-out ${isSidebarOpen ? 'block' : 'hidden'}`}>

                {/* Sidebar Title */}
                <h2 className="text-[var(--text-semi-bold-color)] text-3xl font-semibold pl-4">Lorem</h2>

                {/* Start Sidebar menu navigation */}
                <nav>
                    <a
                        href="#"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Beranda' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Beranda')}
                    >
                        <i className='bx bxs-grid-alt mr-2 font-medium'></i> {/* Ikon untuk Beranda */}
                        Beranda
                    </a>


                    {/*Start Role Student and Teacher menu */}


                    <div>
                        <button
                            className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kesiswaan' ? 'active' : ''}`}
                            onClick={toggleDropdownKesiswaan}
                        >
                            <i className='bx bxs-book mr-3'></i>
                            <a href="#" className='mr-14 font-medium'> Kesiswaan</a>
                            <svg
                                className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpenKesiswaan ? 'rotate' : ''} ${activeMenu === 'Kesiswaan' ? 'text-white' : 'text-[var(--text-thin-color)]'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className={` ${isDropdownOpenKesiswaan ? '' : 'hidden'}`}>
                            <a
                                href=""
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Absensi' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Absensi')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Absensi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Absensi
                            </a>

                            <a
                                href=""
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pelanggaran' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Pelanggaran')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pelanggaran' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Pelanggaran
                            </a>


                            <a
                                href=""
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Klaim Asuransi' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Klaim Asuransi')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Klaim Asuransi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Klaim Asuransi
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
                        href=""
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Keuangan' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Keuangan')}
                    >
                        <i className='bx bxs-report mr-2 font-medium'></i> {/* Ikon untuk Keuangan */}
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
                        href=""
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Sarpras' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Sarpras')}
                    >
                        <i className='bx bxs-chalkboard mr-2 font-medium'></i> {/* Ikon untuk Sarpras */}
                        Sarpras
                    </a>
                    <a
                        href="/student-affairs/student-absence"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Absensi Siswa' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Absensi Siswa')}
                    >
                        <i className='bx bxs-contact mr-2 font-medium'></i> {/* Ikon untuk Absensi Siswa */}
                        Absensi Siswa
                    </a>
                    <a
                        href="/student-affairs/student-achievement"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Prestasi Siswa' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Prestasi Siswa')}
                    >
                        <i className='bx bxs-archive mr-2 font-medium'></i> {/* Ikon untuk Prestasi Siswa */}
                        Prestasi Siswa
                    </a>
                    <a
                        href="/student-affairs/student-violations"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Pelanggaran Siswa' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Pelanggaran Siswa')}
                    >
                        <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Pelanggaran Siswa */}
                        Pelanggaran Siswa
                    </a>
                    <a
                        href="/student-affairs/student-claim-insurance"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Klaim Asuransi' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Klaim Asuransi')}
                    >
                        <i className='bx bxs-report mr-2 font-medium'></i> {/* Ikon untuk Klaim Asuransi */}
                        Klaim Asuransi
                    </a>
                    <a
                        href="/student-affairs/news-information"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Informasi Berita' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Informasi Berita')}
                    >
                        <i className='bx bxs-chalkboard mr-2 font-medium'></i> {/* Ikon untuk Informasi Berita */}
                        Informasi Berita
                    </a>

                    {/* Menu Role  */}

                    <div>
                        <button
                            className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Fasilitas Sekolah' ? 'active' : ''}`}
                            onClick={toggleDropdownFasilitas}
                        >
                            <i className='bx bxs-book mr-3'></i>
                            <a href="#" className='font-medium'> Fasilitas Sekolah</a>
                            <svg
                                className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpenFasilitas ? 'rotate' : ''} ${activeMenu === 'Fasilitas Sekolah' ? 'text-white' : 'text-[var(--text-thin-color)]'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className={` ${isDropdownOpenFasilitas ? '' : 'hidden'}`}>
                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Data Fasilitas' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Data Fasilitas')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Data Fasilitas' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Data Fasilitas
                            </a>
                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Data Ruang' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Data Ruang')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Data Ruang' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Data Ruang
                            </a>
                            <a
                                href="#"
                                className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Data Barang' ? 'text-blue-900' : ''}`}
                                onClick={() => handleSubMenuClick('Data Barang')}
                            >
                                <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Data Barang' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                                Data Barang
                            </a>
                        </div>
                    </div>
                    <a
                        href="/facilities/finance/budget-proposal"
                        className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Keuangan' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Keuangan')}
                    >
                        <i className='bx bxs-report mr-2 font-medium'></i> {/* Ikon untuk Keuangan */}
                        Keuangan
                    </a>


                    {/* End Role Facilities  Sidebar Menu */}

                </nav>
                {/* End Sidebar menu navigation  */}

                {/* Login Button */}
                <a href={isLoggedIn ? "/user-profile" : "/login"} className="absolute bottom-5 left-2 right-2 px-3">
                    <button className="flex items-center justify-center w-full py-3 rounded-xl border border-[var(--text-semi-bold-color)] bg-white text-[var(--text-semi-bold-color)] hover:opacity-90 transition">
                        <i className={`bx ${isLoggedIn ? 'bx-user' : 'bx-power-off'} mr-2 font-medium`}></i>
                        {isLoggedIn ? "Profile Anda" : "Login / Masuk"}
                    </button>
                </a>
            </aside>
        </div>)
    );
};

export default Sidebar;