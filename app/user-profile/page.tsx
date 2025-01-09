"use client";

import React from "react";
import "@/app/styles/globals.css";
import Image from "next/image";

export default function UserProfilePage() {
    return (
        <main className="bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Cover Section */}
            <div className="w-full z-0 bg-[var(--main-color)] h-40 relative">
            </div>

            {/* Profile Section */}
            <div className="w-[24rem] sm:w-full max-w-4xl z-10 bg-white rounded-lg shadow -mt-16 mb-5 sm:mb-0 py-12 px-6 flex flex-col sm:flex-row">
                {/* Left Profile Card */}
                <div className="sm:w-1/3 flex flex-col items-center justify-center border-0 sm:border-r sm:pr-6">
                    <div className="w-40 h-40 rounded-full shadow bg-gray-300 overflow-hidden ">
                        {/* Image untuk profile guru */}
                        <Image
                            src="/images/Berita1.jpg"
                            alt="Bukti Surat"
                            className="w-full h-full object-cover"
                            width={256}
                            height={256}
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-700 mt-4">Siswa</h2>
                </div>

                {/* Right Profile Form */}
                <div className="sm:w-2/3 sm:pl-6 mt-6 sm:mt-0">
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">Profile Pengguna</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Nama Lengkap</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >Stefano Lilypaly</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Kelas</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >XI RPL C</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Jurusan</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >Rekayasa Perangkat Lunak</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">NISN</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >0074385837</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">NIS</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >24667/1889.063</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Tanggal Lahir</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >10/20/2001</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Nomor Telepon</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2" >08988996169</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-semi-bold-color)] mb-1">Alamat</label>
                                <p className="text-sm text[var(--text-thin-color)] mt-2 mb-4" >Jl. Sudirman No. 10, Jakarta</p>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 bg-[var(--main-color)] hover:bg-[#2359ab]  transition duration-300  cursor-pointer text-white text-sm font-medium py-3 rounded shadow">
                                <i className="bx bx-power-off"></i> Logout / Keluar
                            </button>
                            <button className="flex items-center justify-center bg-[var(--main-color)] hover:bg-[#2359ab] transition duration-300 cursor-pointer text-white text-sm font-medium py-3 rounded shadow">
                                Ubah Kata Sandi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
