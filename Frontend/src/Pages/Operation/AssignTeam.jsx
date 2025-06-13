import { useState, useEffect } from "react";
import api from "../../api/auth";
import { toast } from "react-toastify";

export default function AssignTeamForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [availableTransports, setAvailableTransports] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingBookings, setSubmittingBookings] = useState(new Set());
  const [fetchingData, setFetchingData] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const fetchData = async (isManual = false) => {
    try {
      setFetchingData(true);
      setIsManualRefresh(isManual);

      const [bookingsRes, guidesRes, transportsRes] = await Promise.all([
        api.get("/booking"),
        api.get("/guide"),
        api.get("/transport"),
      ]);

      setConfirmedBookings(
        bookingsRes.data.filter((b) => b.status === "confirmed")
      );
      setAvailableGuides(guidesRes.data.filter((g) => g.is_active));
      setAvailableTransports(transportsRes.data.filter((t) => t.is_active));

      if (isManual) {
        toast.success("Data refreshed successfully!");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch data: " +
          (error.response?.data?.error || error.message)
      );
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      setFetchingData(false);
      setIsManualRefresh(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const handleAssignGuide = (bookingId, guideId) => {
    const selectedGuide = availableGuides.find((g) => g._id === guideId);
    const selectedBooking = confirmedBookings.find((b) => b._id === bookingId);

    if (selectedGuide && selectedBooking) {
      const existingAssignmentIndex = pendingAssignments.findIndex(
        (a) => a.bookingId === bookingId && a.type === "guide"
      );

      if (existingAssignmentIndex >= 0) {
        const updatedAssignments = [...pendingAssignments];
        updatedAssignments[existingAssignmentIndex] = {
          ...updatedAssignments[existingAssignmentIndex],
          resourceId: guideId,
          resource: selectedGuide,
        };
        setPendingAssignments(updatedAssignments);
      } else {
        setPendingAssignments((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            bookingId,
            booking: selectedBooking,
            type: "guide",
            resourceId: guideId,
            resource: selectedGuide,
          },
        ]);
      }
    }
  };

  const handleAssignTransport = (bookingId, transportId) => {
    const selectedTransport = availableTransports.find(
      (t) => t._id === transportId
    );
    const selectedBooking = confirmedBookings.find((b) => b._id === bookingId);

    if (selectedTransport && selectedBooking) {
      const existingAssignmentIndex = pendingAssignments.findIndex(
        (a) => a.bookingId === bookingId && a.type === "transport"
      );

      if (existingAssignmentIndex >= 0) {
        const updatedAssignments = [...pendingAssignments];
        updatedAssignments[existingAssignmentIndex] = {
          ...updatedAssignments[existingAssignmentIndex],
          resourceId: transportId,
          resource: selectedTransport,
        };
        setPendingAssignments(updatedAssignments);
      } else {
        setPendingAssignments((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            bookingId,
            booking: selectedBooking,
            type: "transport",
            resourceId: transportId,
            resource: selectedTransport,
          },
        ]);
      }
    }
  };

  const getPendingAssignment = (bookingId, type) => {
    return pendingAssignments.find(
      (a) => a.bookingId === bookingId && a.type === type
    );
  };

  const confirmBookingAssignments = async (bookingId) => {
    const bookingAssignments = pendingAssignments.filter(
      (a) => a.bookingId === bookingId
    );

    if (bookingAssignments.length === 0) {
      toast.warning("No assignments to confirm for this booking");
      return;
    }

    setSubmittingBookings((prev) => new Set(prev).add(bookingId));

    try {
      const results = await Promise.all(
        bookingAssignments.map(async (assignment) => {
          try {
            if (assignment.type === "guide") {
              await api.put(`/guide/${assignment.bookingId}/assignguide`, {
                guide_id: assignment.resourceId,
              });
            } else {
              await api.put(
                `/transport/${assignment.bookingId}/assigntransport`,
                {
                  transport_id: assignment.resourceId,
                }
              );
            }
            return { success: true, id: assignment.id, assignment };
          } catch (error) {
            console.error(
              `Failed to assign ${assignment.type} to booking ${assignment.bookingId}:`,
              error
            );
            return { success: false, id: assignment.id, error, assignment };
          }
        })
      );

      const successfulAssignments = results.filter((r) => r.success);
      const failedAssignments = results.filter((r) => !r.success);

      if (successfulAssignments.length > 0) {
        toast.success(
          `Successfully assigned ${successfulAssignments.length} items to booking`
        );

        const updatedBookings = [...confirmedBookings];
        const bookingIndex = updatedBookings.findIndex(
          (b) => b._id === bookingId
        );

        if (bookingIndex >= 0) {
          successfulAssignments.forEach(({ assignment }) => {
            updatedBookings[bookingIndex] = {
              ...updatedBookings[bookingIndex],
              [`${assignment.type}_id`]: assignment.resourceId,
            };
          });

          const updatedBooking = updatedBookings[bookingIndex];
          if (updatedBooking.guide_id && updatedBooking.transport_id) {
            try {
              // First update booking status
              await api.put(`/booking/${bookingId}/status`, {
                status: "completed",
              });

              updatedBookings[bookingIndex] = {
                ...updatedBookings[bookingIndex],
                status: "completed",
              };

              // Then check for invoice and update status only once
              const invoiceResponse = await api.get(
                `/invoice?booking_id=${bookingId}`
              );
              if (invoiceResponse.data.length > 0) {
                const invoiceId = invoiceResponse.data[0]._id;
                // Only update invoice status if it's not already 'sent'
                if (invoiceResponse.data[0].status !== "sent") {
                  await api.put(`/invoice/${invoiceId}/status`, {
                    status: "sent",
                  });
                  toast.success("Booking marked as completed and invoice sent");
                } else {
                  toast.success(
                    "Booking marked as completed (invoice was already sent)"
                  );
                }
              } else {
                toast.warning("No invoice found for this booking");
              }
            } catch (error) {
              console.error("Failed to update booking/invoice status:", error);
              toast.error("Failed to update booking/invoice status");
            }
          }
          setConfirmedBookings(updatedBookings);
        }
      }

      if (failedAssignments.length > 0) {
        toast.error(`Failed to assign ${failedAssignments.length} items`);
      }

      setPendingAssignments((prev) =>
        prev.filter((a) => a.bookingId !== bookingId)
      );
    } catch (error) {
      console.error("Confirmation error:", error);
      toast.error("Failed to confirm assignments");
    } finally {
      setSubmittingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const getBookingPendingAssignments = (bookingId) => {
    return pendingAssignments.filter((a) => a.bookingId === bookingId);
  };

  const filteredBookings = confirmedBookings.filter(
    (booking) =>
      booking.bookingRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_id?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.package_id?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.travel_start_date
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (

      <div className="p-4 bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Loading bookings and resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center px-6 py-8 border-b border-gray-100 bg-primary-saffron">
        <div>
          <h1 className="text-xl font-bold text-white">Assign Team Members</h1>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={fetchingData}
          className="px-4 py-2 text-sm rounded-md text-orange-600 transition-all duration-200 bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
        >
          {fetchingData && isManualRefresh ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          

                  <input
              type="text"
              placeholder="Search by customer, email, or package..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>
        </div>
      </div>

      {/* Confirmed Bookings Table */}
      <h2 className="p-1 text-2xl font-bold text-black">Confirmed Bookings</h2>
      
      <div className="bg-white rounded-xl border-orange-100 overflow-hidden">

        <h2 className="text-2xl font-bold text-black">Confirmed Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className=" px-8 py-6 bg-secondary-green">
              <tr>

                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Booking Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Schedule</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Guide</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Transport</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Action</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.709M6.343 14.657L4.93 16.07M19.071 8.929l-1.414 1.414"
                        />
                      </svg>
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const bookingPendingAssignments =
                    getBookingPendingAssignments(booking._id);
                  const isSubmitting = submittingBookings.has(booking._id);

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-orange-25 transition-colors duration-150"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {booking.package_id?.title}
                          </div>
                          <div className="text-sm text-orange-600 font-medium">
                            Ref: {booking.bookingRef}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.travel_start_date} to{" "}
                            {booking.travel_end_date}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {booking.num_travelers} people
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900">
                            {booking.customer_id?.name}
                          </div>
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(
                              booking.travel_start_date
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            to{" "}
                            {new Date(
                              booking.travel_end_date
                            ).toLocaleDateString()}
                          </div>
                          {booking.package_id?.duration_days && (
                            <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium inline-block">
                              {booking.package_id.duration_days} days
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {booking.guide_id ? (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900">
                              {
                                availableGuides.find(
                                  (g) => g._id === booking.guide_id
                                )?.name
                              }
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Assigned
                            </span>
                          </div>
                        ) : (
                          <>
                            {getPendingAssignment(booking._id, "guide") ? (
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-900">
                                  {
                                    getPendingAssignment(booking._id, "guide")
                                      .resource.name
                                  }
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Pending confirmation
                                </span>
                              </div>
                            ) : (
                              <select
                                onChange={(e) =>
                                  e.target.value &&
                                  handleAssignGuide(booking._id, e.target.value)
                                }
                                value=""
                                className="w-full p-3 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent shadow-sm bg-white"
                              >
                                <option value="">Select Guide</option>
                                {availableGuides.map((guide) => (
                                  <option key={guide._id} value={guide._id}>
                                    {guide.name} -{" "}
                                    {guide.specialization || "General Guide"}
                                  </option>
                                ))}
                              </select>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {booking.transport_id ? (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-gray-900">
                              {
                                availableTransports.find(
                                  (t) => t._id === booking.transport_id
                                )?.name
                              }
                            </div>
                            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                              {
                                availableTransports.find(
                                  (t) => t._id === booking.transport_id
                                )?.type
                              }
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded block w-fit">
                              Assigned
                            </span>
                          </div>
                        ) : (
                          <>
                            {getPendingAssignment(booking._id, "transport") ? (
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-900">
                                  {
                                    getPendingAssignment(
                                      booking._id,
                                      "transport"
                                    ).resource.name
                                  }
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Pending confirmation
                                </span>
                              </div>
                            ) : (
                              <select
                                onChange={(e) =>
                                  e.target.value &&
                                  handleAssignTransport(
                                    booking._id,
                                    e.target.value
                                  )
                                }
                                value=""
                                className="w-auto p-3 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-transparent shadow-sm bg-white"
                              >
                                <option value="">Select Transport</option>
                                {availableTransports.map((transport) => (
                                  <option
                                    key={transport._id}
                                    value={transport._id}
                                  >
                                    {transport.name} - {transport.type}
                                  </option>
                                ))}
                              </select>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {bookingPendingAssignments.length > 0 ? (
                          <div className="space-y-2">
                            <button
                              onClick={() =>
                                confirmBookingAssignments(booking._id)
                              }
                              disabled={isSubmitting}
                              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                                isSubmitting
                                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                  : "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                              }`}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Processing...
                                </span>
                              ) : (
                                `Confirm (${bookingPendingAssignments.length})`
                              )}
                            </button>
                            <div className="text-xs text-gray-500">
                              {bookingPendingAssignments
                                .map((a) => a.type)
                                .join(", ")}{" "}
                              pending
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            {booking.guide_id && booking.transport_id
                              ? "Complete"
                              : "Select assignments"}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
