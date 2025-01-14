import "@/app/styles/globals.css";
import Image from 'next/image';
import RootLayout from "@/app/layout";

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
                        <Image
                            src="/images/Berita1.jpg"
                            alt="Sosialisasi Prakerin Orang Tua"
                            className="w-full object-cover rounded-lg"
                            width={640} 
                            height={360} 
                        />
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold text-[var(--main-color)]">27</span>
                                    <span className="text-4xl font-bold text-[var(--third-color)]">01</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)]">
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

                        <h3 className="text-3xl font-semibold mt-8 max-w-272px ml-6">Silahkan masuk atau login untuk mengakses keseluruhan fitur fitur</h3>
                    </div>
                </div>


                {/* Start 4 Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#1f509a2b] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--main-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-user-badge text-2xl' /> {/* Ikon untuk Guru */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Guru</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 200 guru yang mengajar</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#e88e1f29] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--second-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-graduation text-2xl' /> {/* Ikon untuk Siswa */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Siswa</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 1000 siswa</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-[#0a97b029] rounded-full w-16 h-16 flex items-center justify-center">
                            <div className="rounded-full bg-[var(--third-color)] w-10 h-10 flex items-center justify-center">
                                <i className='text-white bx bxs-briefcase text-2xl' /> {/* Ikon untuk Karyawan */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-[var(--text-semi-bold-color)]">Total Jumlah Karyawan</h4>
                            <p className="text-sm text-[var(--text-regular-color)]">Terdapat total 100 karyawan</p>
                        </div>
                    </div>
                </div>
                {/* End 4 Card */}


            </main>
        </div>
    );
}