import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';


const DataTable = ({ columns, data, title, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  if (!Array.isArray(data) || !Array.isArray(columns)) {
    return (
      <div className="p-6 text-gray-500 text-sm text-center">
        No data available to display.
      </div>
    );
  }


  const totalPages = Math.ceil(data.length / pageSize);


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });


  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={16} className="opacity-40" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="text-orange-500" />
    ) : (
      <ChevronDown size={16} className="text-orange-500" />
    );
  };


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>
      )}


      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none transition-colors duration-200
                    ${
                      sortConfig.key === column.key
                        ? 'text-orange-600 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-orange-500'
                    }
                  `}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  scope="col"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable !== false && <span>{getSortIcon(column.key)}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>


          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-orange-50 transition-colors duration-150 rounded-md"
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
          </div>


          <div className="flex space-x-2">
            <button
              className="p-2 rounded-md hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>


            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md text-sm font-medium transition
                  ${
                    currentPage === index + 1
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-orange-100'
                  }
                `}
                onClick={() => setCurrentPage(index + 1)}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}


            <button
              className="p-2 rounded-md hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default DataTable;



