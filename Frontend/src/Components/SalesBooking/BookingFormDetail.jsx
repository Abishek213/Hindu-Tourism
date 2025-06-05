
export default function BookingDetails({
  form,
  errors,
  onChange,
  onTravelersChange,
  packages = [],
  destinations = []
}) {

  const filteredPackages = form.destination
    ? packages.filter(pkg => pkg.title === form.destination)
    : [];
  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-gray-800">Booking Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Destination Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Destination</label>
          <select
            name="destination"
            value={form.destination}
            onChange={onChange}
            className={`w-full p-2 border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          >
            <option value="">Select Destination</option>
            {destinations.map(destination => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
          {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
        </div>

        {/* Package Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Package Type</label>
          <select
            name="packageType"
            value={form.packageType}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="Premium">Premium</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Exclusive">Exclusive</option>
          </select>
        </div>

        {/* Number of Travelers */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Number of Travelers</label>
          <input
            type="number"
            name="travelers"
            min="1"
            value={form.travelers}
            placeholder="Enter number"
            onChange={onTravelersChange}
            className={`w-full p-2 border ${errors.travelers ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={onChange}
            className={`w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
        </div>
      </div>
    </div>
  );
}
