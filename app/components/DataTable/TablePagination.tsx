interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalEntries: number;
    entriesPerPage: number;
    startIndex: number;
}

export default function TablePagination({
    currentPage,
    totalPages,
    onPageChange,
    totalEntries,
    entriesPerPage,
    startIndex
}: TablePaginationProps) {
    return (
        <div className="flex justify-between items-center mt-5">
            <span className="text-xs sm:text-sm">
                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
            </span>

            <div className="flex items-center">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-[var(--main-color)]"
                >
                    &lt;
                </button>
                <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`rounded-md px-3 py-1 ${
                                currentPage === page 
                                    ? 'bg-[var(--main-color)] text-white' 
                                    : 'text-[var(--main-color)]'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-[var(--main-color)]"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}