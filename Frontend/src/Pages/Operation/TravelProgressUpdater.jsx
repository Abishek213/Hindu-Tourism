import React, { useState, useEffect } from "react";
import { CalendarDays, XCircle, Users, Search, Filter } from "lucide-react";
import {
  fetchBookings,
  updateTravelStatus,
} from "../../services/transportProgressService";

const statusColors = {
  Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Completed: "bg-gray-100 text-gray-700 border-gray-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const travelStatusColors = {
  "Not Started": "bg-gray-100 text-gray-700 border-gray-200",
  "On the Way": "bg-blue-100 text-blue-700 border-blue-200",
  "At Destination": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Return Journey": "bg-purple-100 text-purple-700 border-purple-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Delayed: "bg-amber-100 text-amber-700 border-amber-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function BookingMonitor() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentTravelStatus, setCurrentTravelStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from backend
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBookings();

        // Transform backend data to match frontend structure
        const transformedBookings = data.map((booking) => ({
          id: booking._id,
          customer: booking.customer_id?.name || "Unknown Customer",
          email: booking.customer_id?.email || "No email",
          package: booking.package_id?.title || "Unknown Package",
          date: new Date(booking.travel_start_date).toISOString().split("T")[0],
          travelers: booking.num_travelers,
          status: booking.status,
          guide: booking.guide_id?.name || "",
          transport: booking.transport_id?.name || "",
          travelStatus: booking.travelStatus || "Not Started",
          // Store additional required fields
          originalData: {
            travel_start_date: booking.travel_start_date,
            travel_end_date: booking.travel_end_date,
            num_travelers: booking.num_travelers,
          },
        }));

        setBookings(transformedBookings);
        setError(null);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.package.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openStatusUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setCurrentTravelStatus(booking.travelStatus);
    setIsStatusModalOpen(true);
  };

  //   const handleUpdateTravelStatus = async () => {
  //   if (selectedBooking) {
  //     try {
  //       // Only send travelStatus now
  //       await updateTravelStatus(selectedBooking.id, currentTravelStatus);

  //       // Update local state
  //       setBookings(prev =>
  //         prev.map(booking =>
  //           booking.id === selectedBooking.id
  //             ? { ...booking, travelStatus: currentTravelStatus }
  //             : booking
  //         )
  //       );

  //       setIsStatusModalOpen(false);
  //     } catch (err) {
  //       console.error('Update failed:', err);
  //       setError('Failed to update travel status. Please try again.');
  //     }
  //   }
  // };

  const handleUpdateTravelStatus = async () => {
    if (selectedBooking) {
      try {
        setIsLoading(true); // Show loading state during update
        await updateTravelStatus(selectedBooking.id, currentTravelStatus);

        // Refresh bookings after successful update
        const data = await fetchBookings();
        const transformedBookings = data.map((booking) => ({
          id: booking._id,
          customer: booking.customer_id?.name || "Unknown Customer",
          email: booking.customer_id?.email || "No email",
          package: booking.package_id?.title || "Unknown Package",
          date: new Date(booking.travel_start_date).toISOString().split("T")[0],
          travelers: booking.num_travelers,
          status: booking.status,
          guide: booking.guide_id?.name || "",
          transport: booking.transport_id?.name || "",
          travelStatus: booking.travelStatus || "Not Started",
          originalData: {
            travel_start_date: booking.travel_start_date,
            travel_end_date: booking.travel_end_date,
            num_travelers: booking.num_travelers,
          },
        }));

        setBookings(transformedBookings);
        setIsStatusModalOpen(false);
        setError(null);
      } catch (err) {
        console.error("Update failed:", err);
        setError("Failed to update travel status. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4  bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4  bg-white rounded-lg shadow-md">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border max-w-md">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4  bg-white rounded-lg shadow-md">
      {/* Header */}

      <div
        className="mb-6 flex justify-between items-center px-6 py-8 border-b border-gray-100
       bg-primary-saffron"
      >

        <div>
          <h1 className="text-xl font-bold text-white">
            Travel Progress Updater
          </h1>
        </div>
      </div>

      <p className="text-gray-600 text-sm">
        {bookings.length} bookings • {filteredBookings.length} match your search
      </p>


      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by customer, email, or package..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className=" px-8 py-6 bg-secondary-green border-secondary-green-700">
                <tr className="text-white font-semibold">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Package & Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Travelers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Travel Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Assignments</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-900 text-xs md:text-sm truncate max-w-[150px]">
                          {b.email}
                        </div>
                        <div className="text-gray-600 text-xs truncate max-w-[150px]">
                          {b.customer}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-xs md:text-sm">
                        {b.package}
                      </div>
                      <div className="text-gray-600 flex items-center gap-1 mt-1 text-xs">
                        <CalendarDays className="w-3 h-3" />
                        {b.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-900 text-xs md:text-sm">
                        <Users className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        {b.travelers}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          statusColors[b.status]
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          travelStatusColors[b.travelStatus]
                        }`}
                      >
                        {b.travelStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs md:text-sm">
                        <div className="text-gray-900">
                          {b.guide || (
                            <span className="text-red-500 text-xs">
                              No Guide
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600">
                          {b.transport || (
                            <span className="text-red-500 text-xs">
                              No Transport
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openStatusUpdateModal(b)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition flex items-center"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Travel Status Update Modal */}
      {isStatusModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Update Travel Status
                </h3>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Booking ID: {selectedBooking.id}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Current Travel Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    travelStatusColors[selectedBooking.travelStatus]
                  }`}
                >
                  {selectedBooking.travelStatus}
                </span>
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm mb-1">
                  Update Travel Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  value={currentTravelStatus}
                  onChange={(e) => setCurrentTravelStatus(e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="On the Way">On the Way</option>
                  <option value="At Destination">At Destination</option>
                  <option value="Return Journey">Return Journey</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTravelStatus}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
