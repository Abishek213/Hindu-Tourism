import { useState } from "react";
import { FileText, Download, Search, User } from "lucide-react";

const dummyDocs = [
  {
    id: "DOC-001",
    customer: "Ravi Kumar",
    type: "Passport",
    fileName: "ravi_passport.pdf",
    url: "/docs/ravi_passport.pdf"
  },
  {
    id: "DOC-002",
    customer: "Anjali Mehta",
    type: "Flight Ticket",
    fileName: "anjali_ticket.pdf",
    url: "/docs/anjali_ticket.pdf"
  },
  {
    id: "DOC-003",
    customer: "Arun Sharma",
    type: "Government ID",
    fileName: "arun_id.pdf",
    url: "/docs/arun_id.pdf"
  }
];

export default function DocumentViewer() {
  const [search, setSearch] = useState("");

  const filteredDocs = dummyDocs.filter((doc) =>
    doc.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Document Viewer</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-500" /> {doc.type}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" /> {doc.customer}
              </p>
              <p className="text-sm text-gray-400">{doc.fileName}</p>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm font-medium bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              <Download className="w-4 h-4 mr-1" /> View
            </a>
          </div>
        ))}
        {filteredDocs.length === 0 && (
          <p className="text-center text-gray-500">No documents found.</p>
        )}
      </div>
    </div>
  );
}
