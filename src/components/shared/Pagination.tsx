import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    pages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (count: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    pages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    // Handle undefined or invalid values
    const safeTotalItems = totalItems || 0;
    const safeTotalPages = pages || 1;
    const safeCurrentPage = currentPage || 1;
    const safeItemsPerPage = itemsPerPage || 10;

    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = Math.min(startIndex + safeItemsPerPage, safeTotalItems);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(safeTotalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pages?.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    className={`px-3 py-1 rounded-md ${safeCurrentPage === 1
                        ? 'bg-[#ff6b00] text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                        }`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages?.push(<span key="dots-start" className="px-2">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 rounded-md ${safeCurrentPage === i
                        ? 'bg-[#ff6b00] text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < safeTotalPages) {
            if (endPage < safeTotalPages - 1) {
                pages?.push(<span key="dots-end" className="px-2">...</span>);
            }
            pages?.push(
                <button
                    key="last"
                    onClick={() => onPageChange(safeTotalPages)}
                    className={`px-3 py-1 rounded-md ${safeCurrentPage === safeTotalPages
                        ? 'bg-[#ff6b00] text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                        }`}
                >
                    {safeTotalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="bg-white px-4 py-3 border-t rounded-b-lg border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={e => onItemsPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                    >
                        {[5, 10, 25, 50, 100].map(val => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700">per page</span>
                </div>

                <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {endIndex} of {safeTotalItems} results
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => onPageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className="px-2 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft className="h-4 w-4" />
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={() => onPageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === safeTotalPages}
                        className="px-2 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;

