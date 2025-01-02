export default function guestDashboard() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex flex-col items-start py-4 px-10 shadow-md bg-gray-200">
                <div className="text-lg font-semibold">Beranda</div>
                <div className="mt-0">
                    <span>Halo, selamat datang di website kami</span>
                </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 py-4 px-10 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 shadow rounded-lg max-h-61">
                        <img src="images/Baksos-Sumbermanjing.webp" alt="Sosialisasi" className="w-full h-[55%] object-cover rounded-lg" />
                        <div className="p-2 flex items-center">
                            <div className="mr-4 text-center">
                                <div className="text-4xl font-bold text-blue-600">27</div>
                                <div className="text-4xl font-bold text-teal-500">01</div>
                            </div>
                            <div className="pt-4">
                                <h4 className="text-xl font-semibold">Sosialisasi Prakerin Orang Tua</h4>
                                <p className="text-sm text-gray-600">
                                    Sosialisasi terkait pemberangkatan prakerin untuk orang tua siswa yang dilaksanakan di Home Teater jam 9 pagi tanggal 27 bulan Januari.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-500 p-4 shadow rounded-lg text-white max-h-60">
                        <img src="/path/to/image2.jpg" alt="Fitur" className="w-full h-28 object-cover rounded-t-lg" />
                        <div className="p-2">
                            <h4 className="text-xl font-semibold">Masuk Untuk Mengakses Semua Fitur</h4>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className="p-4">
                            <h4 className="text-xl font-semibold">Total Jumlah Guru</h4>
                            <p className="text-sm text-gray-600">Terdapat total 200 guru yang mengajar</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className="p-4">
                            <h4 className="text-xl font-semibold">Total Jumlah Siswa</h4>
                            <p className="text-sm text-gray-600">Terdapat total 1000 orang yang terdaftar sebagai siswa/siswi</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className="p-4">
                            <h4 className="text-xl font-semibold">Total Jumlah Karyawan</h4>
                            <p className="text-sm text-gray-600">Terdapat 100 karyawan yang bekerja</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}