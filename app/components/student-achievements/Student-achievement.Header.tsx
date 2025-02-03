interface StudentAchievementHeaderProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FacilityHeader: React.FC<StudentAchievementHeaderProps> = ({ searchTerm, onSearchChange }) => (
    <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pelanggaran Siswa</h1>
            <p className="text-sm text-gray-600">Halo Admin Kesiswaan, selamat datang kembali</p>
        </div>
        <div className="mt-4 sm:mt-0">
            <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="border-0 focus:outline-none text-base w-40"
                />
            </div>
        </div>
    </header>
);