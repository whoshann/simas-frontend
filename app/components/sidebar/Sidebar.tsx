"use client"

import React, { useState } from 'react';

const Sidebar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>('Beranda');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setActiveMenu('Kesiswaan'); // Set active menu to Kesiswaan when dropdown is opened
        }
    };
    const toggleDropdownStudentAffairs = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setActiveMenu('Fasilitas Sekolah'); // Set active menu to Fasilitas Sekolah when dropdown is opened
        }
    };

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        setIsDropdownOpen(false); // Close dropdown when another menu is clicked
    };

    const handleSubMenuClick = (submenu: string) => {
        setActiveMenu(submenu);
        // Do not close dropdown
    };

    return (
        // sidebar wrapper
        (<div className="bg-white w-64 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-300 ease-in-out">
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
                <div>
                    <button
                        className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kesiswaan' ? 'active' : ''}`}
                        onClick={toggleDropdown}
                    >
                        <i className='bx bxs-book mr-3'></i>
                        <a href="#" className='mr-14 font-medium'> Kesiswaan</a>
                        <svg
                            className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate' : ''} ${activeMenu === 'Kesiswaan' ? 'text-white' : 'text-[var(--text-thin-color)]'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className={` ${isDropdownOpen ? '' : 'hidden'}`}>
                        <a
                            href="#"
                            className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Absensi' ? 'text-blue-900' : ''}`}
                            onClick={() => handleSubMenuClick('Absensi')}
                        >
                            <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Absensi' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                            Absensi
                        </a>
                        <a
                            href="#"
                            className={`block py-3 px-4 rounded-xl transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Pelanggaran' ? 'text-blue-900' : ''}`}
                            onClick={() => handleSubMenuClick('Pelanggaran')}
                        >
                            <span className={`inline-block w-2 h-2 font-medium rounded-full mr-2 ${activeMenu === 'Pelanggaran' ? 'bg-[var(--main-color)]' : 'bg-[var(--text-thin-color)]'}`}></span>
                            Pelanggaran
                        </a>
                        <a
                            href="#"
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
                    href="#"
                    className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Keuangan' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Keuangan')}
                >
                    <i className='bx bxs-wallet mr-2 font-medium'></i> {/* Ikon untuk Keuangan */}
                    Keuangan
                </a>
                <a
                    href="#"
                    className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kurikulum' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Kurikulum')}
                >
                    <i className='bx bxs-report mr-2 font-medium'></i> {/* Ikon untuk Kurikulum */}
                    Kurikulum
                </a>
                <a
                    href="#"
                    className={`block py-3 px-4 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Sarpras' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Sarpras')}
                >
                    <i className='bx bxs-chalkboard mr-2 font-medium'></i> {/* Ikon untuk Sarpras */}
                    Sarpras
                </a>

                {/* Start Role Affairs Sidebar Menu */}

                <div>
                    <button
                        className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-xl transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Fasilitas Sekolah' ? 'active' : ''}`}
                        onClick={toggleDropdownStudentAffairs}  
                    >
                        <i className='bx bxs-book mr-3'></i>
                        <a href="#" className='font-medium'> Fasilitas Sekolah</a>
                        <svg
                            className={`h-4 w-4 ml-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate' : ''} ${activeMenu === 'Fasilitas Sekolah' ? 'text-white' : 'text-[var(--text-thin-color)]'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className={` ${isDropdownOpen ? '' : 'hidden'}`}>
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

                {/* Enda Role Affairs Sidebar Menu */}

            </nav>
            {/* End Sidebar menu navigation  */}
            {/* Login Button */}
            <a href="/login" className="absolute bottom-5 left-2 right-2 px-3">
                <button className="flex items-center justify-center w-full py-3 rounded-xl border border-[var(--text-semi-bold-color)] bg-white text-[var(--text-semi-bold-color)] hover:opacity-90 transition">
                    <i className='bx bx-power-off mr-2 font-medium'></i>
                    Login / Masuk
                </button>
            </a>
        </div>)
    );
};

export default Sidebar;