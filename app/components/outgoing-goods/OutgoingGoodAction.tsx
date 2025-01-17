interface OutgoingGoodsActionsProps {
    entriesPerPage: number;
    onEntriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onAddClick: () => void;
    dropdownOpen: boolean;
    setDropdownOpen: (isOpen: boolean) => void;
}

export const OutgoingGoodsActions: React.FC<OutgoingGoodsActionsProps> = ({
    entriesPerPage,
    onEntriesChange,
    onAddClick,
    dropdownOpen,
    setDropdownOpen
}) => (
    <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
        <div className="text-xs sm:text-base">
            <label className="mr-2">Tampilkan</label>
            <select
                value={entriesPerPage}
                onChange={onEntriesChange}
                className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
            </select>
            <label className="ml-2">Entri</label>
        </div>

        <div className="flex space-x-2 mt-5 sm:mt-0">
            <button
                onClick={onAddClick}
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
);
