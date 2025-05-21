// components/BookingDetails.jsx
export default function BookingDetails({ 
  form, 
  errors, 
  handleChange, 
  handleTravelersChange, 
  guideOptions, 
  transportTeamOptions 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID/Name</label>
        <input
          type="text"
          name="leadId"
          placeholder="Enter lead ID or client name"
          value={form.leadId}
          onChange={handleChange}
          aria-invalid={errors.leadId ? "true" : "false"}
          className={`w-full p-2 border ${errors.leadId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.leadId && <p className="mt-1 text-xs text-red-500">{errors.leadId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          placeholder="Enter 10-digit mobile number"
          value={form.contactNumber}
          onChange={handleChange}
          aria-invalid={errors.contactNumber ? "true" : "false"}
          className={`w-full p-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber}</p>}
      </div>
        
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          name="emailAddress"
          placeholder="Email address"
          value={form.emailAddress}
          onChange={handleChange}
          aria-invalid={errors.emailAddress ? "true" : "false"}
          className={`w-full p-2 border ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.emailAddress && <p className="mt-1 text-xs text-red-500">{errors.emailAddress}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount (₹)</label>
        <input
          type="text"
          name="advanceAmount"
          placeholder="Enter amount"
          value={form.advanceAmount}
          onChange={handleChange}
          aria-invalid={errors.advanceAmount ? "true" : "false"}
          className={`w-full p-2 border ${errors.advanceAmount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.advanceAmount && <p className="mt-1 text-xs text-red-500">{errors.advanceAmount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <select
          name="destination"
          value={form.destination}
          onChange={handleChange}
          aria-invalid={errors.destination ? "true" : "false"}
          className={`w-full p-2 border ${errors.destination ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select Destination</option>
          <option value="Pashupatinath">Pashupatinath</option>
          <option value="Muktinath">Muktinath</option>
          <option value="Both">Pashupatinath + Muktinath</option>
        </select>
        {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
      </div>
          
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Packages</label>
        <select
          name="package"
          value={form.package}
          onChange={handleChange}
          aria-invalid={errors.package ? "true" : "false"}
          className={`w-full p-2 border ${errors.package ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select Package</option>
          <option value="Premium">Premium Package</option>
          <option value="Deluxe">Delux Package</option>
          <option value="Exclusive">Exclusive Package</option>
        </select>
        {errors.package && <p className="mt-1 text-xs text-red-500">{errors.package}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
        <input
          type="number"
          name="travelers"
          min="1"
          value={form.travelers}
          placeholder="Enter number"
          onChange={handleTravelersChange}
          aria-invalid={errors.travelers ? "true" : "false"}
          className={`w-full p-2 border ${errors.travelers ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          aria-invalid={errors.startDate ? "true" : "false"}
          className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          aria-invalid={errors.endDate ? "true" : "false"}
          className={`w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Guide</label>
        <select
          name="guide"
          value={form.guide}
          onChange={handleChange}
          aria-invalid={errors.guide ? "true" : "false"}
          className={`w-full p-2 border ${errors.guide ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select Guide</option>
          {guideOptions.map((guide, index) => (
            <option key={index} value={guide}>{guide}</option>
          ))}
        </select>
        {errors.guide && <p className="mt-1 text-xs text-red-500">{errors.guide}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transport Team</label>
        <select
          name="transportTeam"
          value={form.transportTeam}
          onChange={handleChange}
          aria-invalid={errors.transportTeam ? "true" : "false"}
          className={`w-full p-2 border ${errors.transportTeam ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select Transport Team</option>
          {transportTeamOptions.map((team, index) => (
            <option key={index} value={team}>{team}</option>
          ))}
        </select>
        {errors.transportTeam && <p className="mt-1 text-xs text-red-500">{errors.transportTeam}</p>}
      </div>
    </div>
  );
}