import React, { useState } from "react";
import TableActions2 from "./TableAction2";
import TablePagination2 from "./TablePagination2";

interface TableHeader {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableData2Props {
    headers: TableHeader[];
    data: any[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    entriesPerPage: number;
    setEntriesPerPage: (value: number) => void;
}

export default function TableData2({
    headers,
    data,
    searchTerm,
    setSearchTerm,
    entriesPerPage,
    setEntriesPerPage,
}: TableData2Props) {
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data berdasarkan search term
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
        <div className="bg-white shadow-md rounded-lg p-6">
            {/* Table Actions */}
            <TableActions2
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50">
                                {headers.map((header) => (
                                    <td key={header.key} className="px-4 py-3 border-b">
                                        {header.render
                                            ? header.render(item[header.key], item)
                                            : item[header.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <TablePagination2
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalEntries={totalEntries}
                entriesPerPage={entriesPerPage}
                startIndex={startIndex}
            />
        </div>
    );
}