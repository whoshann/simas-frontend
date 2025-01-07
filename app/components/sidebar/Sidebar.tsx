"use client"

import React, { useState } from 'react';

const Sidebar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenKesiswaan, setIsDropdownOpenKesiswaan] = useState(false);
    const [isDropdownOpenFasilitas, setIsDropdownOpenFasilitas] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>('Beranda');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setActiveMenu('Kurikulum'); // Set active menu to Kurikulum when dropdown is opened
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
        <div className="bg-white w-64 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-300 ease-in-out">
            <h2 className="text-[var(--text-bold-color)] text-3xl font-semibold pl-10">Lorem</h2>
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
                        className={`flex items-center w-full text-left py-3 pl-4 pr-0 rounded-md transition duration-200 text-[var(--text-thin-color)] ${activeMenu === 'Kurikulum' ? 'active' : ''}`}
                        onClick={toggleDropdown}
                    >
                        <i className='bx bxs-book mr-3'></i>
                        <a href="#" className='mr-14'> Kurikulum</a>
                        <svg className={`h-4 w-4 ml-5 text-[var(--text-thin-color)] transition-transform duration-200 ${isDropdownOpen ? 'rotate' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className={` ${isDropdownOpenKesiswaan ? '' : 'hidden'}`}>
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
                            className={`block py-3 px-4 rounded-md transition duration-200 submenu text-[var(--text-thin-color)] ${activeMenu === 'Submenu 1' ? 'active' : ''}`}
                            onClick={() => handleSubMenuClick('Submenu 1')}
                        >
                            <span className="inline-block w-2 h-2 bg-[var(--text-thin-color)] rounded-full mr-2"></span>Submenu 1
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
    
};

export default Sidebar;