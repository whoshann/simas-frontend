import "@/app/styles/globals.css";

export default function GuestDashboard() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
            <header className="py-6 px-9">
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Beranda</h1>
                <p className="text-sm text-gray-600">Halo, selamat datang di website kami</p>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto px-9 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* News Card */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden lg:col-span-2">
                        <img
                            src="/images/Berita1.jpg"
                            alt="Sosialisasi Prakerin Orang Tua"
                            className="w-full object-cover rounded-lg"
                        />
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold text-[var(--main-color)]">27</span>
                                    <span className="text-4xl font-bold text-[var(--third-color)]">01</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Sosialisasi Prakerin Orang Tua
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Sosialisasi terkait pemberangkatan prakerin untuk orang tua siswa
                                        yang dilaksanakan di Home Teater jam 9 pagi tanggal 27 bulan Januari.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card feture acces*/}
                    <div className="bg-[var(--main-color)] text-white shadow-md rounded-lg flex flex-col justify-between p-6">
                        <img
                            src="/images/IlustrasiGuest.svg"
                            alt="Deskripsi Gambar"
                            className="w-full h-auto mt-7"
                        />
                        <h3 className="text-xl font-semibold mb-3 max-w-272px ml-6">Masuk Untuk Mengakses Semua Fitur</h3>
                    </div>
                </div>


                {/* Start 4 Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <i className='bx bxs-user w-8 h-8' /> {/* Ikon untuk Guru */}
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-gray-800">Total Jumlah Guru</h4>
                            <p className="text-sm text-gray-600">Terdapat total 200 guru yang mengajar</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <i className='bx bxs-graduation w-8 h-8' /> {/* Ikon untuk Siswa */}
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-gray-800">Total Jumlah Siswa</h4>
                            <p className="text-sm text-gray-600">Terdapat total 1000 siswa</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-teal-100 rounded-full">
                            <i className='bx bxs-briefcase w-8 h-8' /> {/* Ikon untuk Karyawan */}
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-gray-800">Total Jumlah Karyawan</h4>
                            <p className="text-sm text-gray-600">Terdapat total 100 karyawan</p>
                        </div>
                    </div>
                </div>
                {/* End 4 Card */}


            </main>
        </div>
    );
}