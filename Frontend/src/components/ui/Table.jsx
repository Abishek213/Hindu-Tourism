// src/components/ui/table.jsx
import React from "react";

export function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-3 text-center">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-t">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
