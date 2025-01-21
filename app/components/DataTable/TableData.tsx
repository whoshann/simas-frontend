import React, { useState } from "react";
import TableActions from "@/app/components/DataTable/TableAction";
import TablePagination from "@/app/components/DataTable/TablePagination";

interface TableHeader {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    headers: TableHeader[];
    data: any[];
    searchTerm: string;
    entriesPerPage: number;
    setEntriesPerPage: (value: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAdd?: () => void;
    onImport?: () => void;
    onExport?: (type: 'pdf' | 'excel') => void;
}

export default function DataTable({
    headers,
    data,
    searchTerm,
    entriesPerPage,
    setEntriesPerPage,
    onEdit,
    onDelete,
    onAdd,
    onImport,
    onExport
}: DataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Fungsi pencarian yang dinamis berdasarkan header
    const filteredData = data.filter((item) =>
        headers.some(header =>
            String(item[header.key])
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(
        startIndex,
        startIndex + entriesPerPage
    );

    return (
        <main className="px-9 pb-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                {/* Table Actions */}
                <TableActions
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                    onAdd={onAdd}
                    onImport={onImport}
                    onExport={onExport}
                />

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                {headers.map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b"
                                    >
                                        {header.label}
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                        Aksi
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((item, index) => (
                                <tr key={item.id || item.no} className="hover:bg-gray-50">
                                    {headers.map((header) => (
                                        <td key={header.key} className="py-2 px-4 border-b">
                                            {header.render
                                                ? header.render(item[header.key], item)
                                                : item[header.key]
                                            }
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-3 border-b">
                                            <div className="flex gap-2">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item.id || item.no)}
                                                        className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                                    >
                                                        <i className='bx bxs-edit text-lg'></i>
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item.id || item.no)}
                                                        className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                                    >
                                                        <i className='bx bxs-trash-alt text-lg'></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalEntries={totalEntries}
                    entriesPerPage={entriesPerPage}
                    startIndex={startIndex}
                />
            </div>
        </main>
    );
}