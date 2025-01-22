interface TableActions2Props {
    entriesPerPage: number;
    setEntriesPerPage: (value: number) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export default function TableActions2({
    entriesPerPage,
    setEntriesPerPage,
    searchTerm,
    setSearchTerm
}: TableActions2Props) {
    return (
        <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
            <div className="text-xs sm:text-base">
                <label className="mr-2">Tampilkan</label>
                <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                <label className="ml-2">Entri</label>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Cari..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
            </div>
        </div>
    );
}