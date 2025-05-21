import { useState } from "react";
import { Search, CalendarCheck, User, MapPin } from "lucide-react";

const dummyBookings = [
  {
    id: "BK-001",
    customer: "Ravi Kumar",
    destination: "Pashupatinath",
    date: "2025-06-12",
    status: "Confirmed"
  },
  {
    id: "BK-002",
    customer: "Anjali Mehta",
    destination: "Muktinath",
    date: "2025-06-15",
    status: "Pending"
  },
  {
    id: "BK-003",
    customer: "Arun Sharma",
    destination: "Pashupatinath & Muktinath",
    date: "2025-07-01",
    status: "Completed"
  }
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800"
};

export default function BookingStatusViewer() {
  const [search, setSearch] = useState("");

  const filtered = dummyBookings.filter(
    (b) =>
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Booking Status Viewer</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by booking ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((b) => (
          <div key={b.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-lg font-semibold text-gray-800">{b.id}</p>
              <p className="flex items-center text-gray-600 text-sm">
                <User className="w-4 h-4 mr-1" /> {b.customer}
              </p>
              <p className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1" /> {b.destination}
              </p>
              <p className="flex items-center text-gray-600 text-sm">
                <CalendarCheck className="w-4 h-4 mr-1" /> {b.date}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[b.status]}`}>
              {b.status}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
