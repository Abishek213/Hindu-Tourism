import { useState, useEffect } from "react";
import { Calendar, MapPin, User, Clock } from "lucide-react";

const dummyTrips = [
  {
    id: 1,
    customer: "Ravi Kumar",
    package: "Pashupatinath Tour",
    startDate: "2025-06-01",
    endDate: "2025-06-05",
    guide: "Suresh Thapa",
    status: "Scheduled",
    destination: "Pashupatinath"
  },
  {
    id: 2,
    customer: "Anjali Mehta",
    package: "Muktinath Adventure",
    startDate: "2025-06-10",
    endDate: "2025-06-15",
    guide: "Ramesh Singh",
    status: "In Progress",
    destination: "Muktinath"
  },
  {
    id: 3,
    customer: "Arun Sharma",
    package: "Combined Pilgrimage",
    startDate: "2025-06-20",
    endDate: "2025-06-30",
    guide: "Bikash Rai",
    status: "Completed",
    destination: "Pashupatinath & Muktinath"
  }
];

export default function TripSchedule() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Replace with actual API call
    setTrips(dummyTrips);
  }, []);

  const statusColors = {
    Scheduled: "bg-yellow-200 text-yellow-800",
    "In Progress": "bg-green-200 text-green-800",
    Completed: "bg-gray-200 text-gray-700"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Trip Schedule</h1>

      <div className="space-y-4">
        {trips.length === 0 && (
          <p className="text-center text-gray-500">No trips scheduled.</p>
        )}

        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm"
          >
            <div className="mb-3 md:mb-0">
              <p className="text-lg font-semibold text-gray-800">{trip.package}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" /> {trip.customer}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {trip.destination}
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-8 text-sm text-gray-700">
              <div className="flex items-center mb-2 md:mb-0">
                <Calendar className="w-5 h-5 mr-1 text-orange-500" />
                <span>{trip.startDate} - {trip.endDate}</span>
              </div>

              <div className="flex items-center mb-2 md:mb-0">
                <User className="w-5 h-5 mr-1 text-orange-500" />
                <span>Guide: {trip.guide}</span>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full font-semibold ${statusColors[trip.status]}`}>
                  {trip.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
