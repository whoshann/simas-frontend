interface RepairsPaginationProps {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    entriesPerPage: number;
    totalEntries: number;
    onPageChange: (page: number) => void;
}

export const RepairsPagination: React.FC<RepairsPaginationProps> = ({
    currentPage,
    totalPages,
    startIndex,
    entriesPerPage,
    totalEntries,
    onPageChange
}) => (
    <div className="flex justify-between items-center mt-5">
        <span className="text-xs sm:text-base">
            Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
        </span>
        {/* ... Pagination buttons ... */}
        <div className="flex items-center">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[var(--main-color)]"
            >
                &lt;
            </button>
            <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages - (currentPage - 1), 2) }, (_, index) => {
                    const pageNumber = currentPage + index;
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                            className={`rounded-md px-3 py-1 ${currentPage === pageNumber ? 'bg-[var(--main-color)] text-white' : 'text-[var(--main-color)]'}`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
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
