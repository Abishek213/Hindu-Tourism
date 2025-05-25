import { useState, useEffect } from "react";
import { Calendar, MapPin, User, Clock, Mountain, Star } from "lucide-react";

const dummyTrips = [
  {
    id: 1,
    customer: "Ravi Kumar",
    package: "Pashupatinath Tour",
    startDate: "2025-06-01",
    endDate: "2025-06-05",
    guide: "Suresh Thapa",
    status: "Scheduled",
    destination: "Pashupatinath",
    price: "₹25,000"
  },
  {
    id: 2,
    customer: "Anjali Mehta",
    package: "Muktinath Adventure",
    startDate: "2025-06-10",
    endDate: "2025-06-15",
    guide: "Ramesh Singh",
    status: "In Progress",
    destination: "Muktinath",
    price: "₹35,000"
  },
  {
    id: 3,
    customer: "Arun Sharma",
    package: "Combined Pilgrimage",
    startDate: "2025-06-20",
    endDate: "2025-06-30",
    guide: "Bikash Rai",
    status: "Completed",
    destination: "Pashupatinath & Muktinath",
    price: "₹55,000"
  }
];

export default function TripSchedule() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    // Replace with actual API call
    setTrips(dummyTrips);
  }, []);

  const statusColors = {
    Scheduled: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200",
    "In Progress": "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200",
    Completed: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200"
  };

  const getDaysRemaining = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Mountain className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Sacred Journey Scheduler</h1>
          </div>
          <p className="text-orange-100 text-lg">Manage your spiritual pilgrimage tours</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Total Trips</p>
                <p className="text-3xl font-bold text-gray-800">{trips.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Active Trips</p>
                <p className="text-3xl font-bold text-gray-800">
                  {trips.filter(t => t.status === "In Progress").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-semibold uppercase tracking-wide">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800">
                  {trips.filter(t => t.status === "Scheduled").length}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Cards */}
        <div className="space-y-6">
          {trips.length === 0 && (
            <div className="text-center py-12">
              <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No sacred journeys scheduled</p>
              <p className="text-gray-400">Your spiritual adventures will appear here</p>
            </div>
          )}

          {trips.map((trip) => {
            const daysRemaining = getDaysRemaining(trip.startDate);
            return (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{trip.package}</h3>
                      <p className="text-orange-100 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {trip.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{trip.price}</p>
                      {trip.status === "Scheduled" && daysRemaining > 0 && (
                        <p className="text-orange-100 text-sm">{daysRemaining} days to go</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold text-gray-800">{trip.customer}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guide</p>
                        <p className="font-semibold text-gray-800">{trip.guide}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[trip.status]}`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for In Progress trips */}
                  {trip.status === "In Progress" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Trip Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg">
                      Manage Trip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}