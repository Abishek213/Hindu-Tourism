import { Users, Wind, Map } from 'lucide-react';

export default function TravelDetailsForm({ form, handleChange }) {
  // Package options with descriptions
  const packages = [
    { value: "Basic", label: "Basic - Standard services" },
    { value: "Premium", label: "Premium - Enhanced comfort" },
    { value: "Luxury", label: "Luxury - VIP experience" },
    { value: "Family", label: "Family - Group discounts" },
    { value: "Pilgrimage", label: "Pilgrimage - Spiritual focus" }
  ];

  return (
    <div className="space-y-4 lg:col-span-1">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <Map className="h-5 w-5 text-orange-500" />
        Travel Details
      </h3>
      
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Destination*
        </label>
        <select
          id="destination"
          name="destination"
          required
          value={form.destination}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select Destination</option>
          <option value="Pashupatinath">Pashupatinath</option>
          <option value="Muktinath">Muktinath</option>
          <option value="Both">Pashupatinath + Muktinath</option>
        </select>
      </div>
    
      <div>
        <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">
          Package Type*
        </label>
        <select
          id="packageType"
          name="packageType"
          required
          value={form.packageType}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg.value} value={pkg.value}>
              {pkg.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="numPeople" className="block text-sm font-medium text-gray-700">
          Number of People* <Users className="inline h-4 w-4 text-gray-500" />
        </label>
        <input
          id="numPeople"
          name="numPeople"
          type="number"
          min="1"
          required
          value={form.numPeople}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <div>
        <label htmlFor="transport" className="block text-sm font-medium text-gray-700">
          Transport* <Wind className="inline h-4 w-4 text-gray-500" />
        </label>
        <select
          id="transport"
          name="transport"
          required
          value={form.transport}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select Transport</option>
          <option value="Helicopter">Helicopter</option>
          <option value="Car">Car</option>
          <option value="Bus">Bus</option>
        </select>
      </div>
    </div>
  );
}