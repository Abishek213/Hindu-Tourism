// TripScheduleViewer.jsx
import React from 'react';

const tripSchedules = [
  { id: 'TS-001', destination: 'Pashupatinath', date: '2025-05-22', guide: 'Raj Kumar' },
  { id: 'TS-002', destination: 'Muktinath', date: '2025-05-25', guide: 'Sita Devi' },
];

export const TripScheduleViewer = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-bold text-orange-600 mb-4">Trip Schedule Viewer</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-orange-100">
          <th className="p-2 text-left">Trip ID</th>
          <th className="p-2 text-left">Destination</th>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Guide</th>
        </tr>
      </thead>
      <tbody>
        {tripSchedules.map(trip => (
          <tr key={trip.id} className="border-b">
            <td className="p-2">{trip.id}</td>
            <td className="p-2">{trip.destination}</td>
            <td className="p-2">{trip.date}</td>
            <td className="p-2">{trip.guide}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default TripScheduleViewer;