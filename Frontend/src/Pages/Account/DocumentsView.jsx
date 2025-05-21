
// DocumentViewer.jsx
import React from 'react';

const sampleDocs = [
  { name: 'KYC_Document.pdf', type: 'KYC' },
  { name: 'Receipt_001.pdf', type: 'Receipt' },
  { name: 'Invoice_001.pdf', type: 'Invoice' },
];

export const DocsViewer = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold text-orange-600 mb-4">Document Viewer</h2>
    <ul className="space-y-2">
      {sampleDocs.map((doc, index) => (
        <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
          <span>{doc.name}</span>
          <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm">Download</button>
        </li>
      ))}
    </ul>
  </div>
);
export default DocsViewer;