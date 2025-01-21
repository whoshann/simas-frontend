import { useState } from 'react';
interface TableActionsProps {
    entriesPerPage: number;
    setEntriesPerPage: (value: number) => void;
    onAdd?: () => void;
    onImport?: () => void;
    onExport?: (type: 'pdf' | 'excel') => void;
}

export default function TableActions({
    entriesPerPage,
    setEntriesPerPage,
    onAdd,
    onImport,
    onExport

}: TableActionsProps) {
    const [showExportDropdown, setShowExportDropdown] = useState(false);
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

            <div className="flex space-x-2 mt-5 sm:mt-0">
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="bg-[var(--main-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#1a4689]"
                    >
                        Tambah Data
                    </button>
                )}
                {onImport && (
                    <button
                        onClick={onImport}
                        className="bg-[var(--second-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#de881f]"
                    >
                        Import Dari Excel
                    </button>
                )}
                {onExport && (
                    <div className="relative">
                        <button
                            onClick={() => setShowExportDropdown(!showExportDropdown)}
                            className="bg-[var(--third-color)] text-white px-4 py-2 sm:py-3 rounded-lg text-xxs sm:text-xs hover:bg-[#09859a] flex items-center"
                        >
                            Export Data
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className={`w-4 h-4 ml-2 transform transition-transform ${showExportDropdown ? 'rotate-180' : ''}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showExportDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        onExport('pdf');
                                        setShowExportDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[var(--text-regular-color)] text-sm rounded-t-lg"
                                >
                                    <i className='bx bxs-file-pdf mr-2'></i>
                                    Export PDF
                                </button>
                                <button
                                    onClick={() => {
                                        onExport('excel');
                                        setShowExportDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[var(--text-regular-color)] text-sm rounded-b-lg"
                                >
                                    <i className='bx bxs-file-export mr-2'></i>
                                    Export Excel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}