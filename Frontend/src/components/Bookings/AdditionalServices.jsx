// components/AdditionalServices.jsx
export default function AdditionalServices({ form, handleChange }) {
  return (
    <div className="mt-2">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ServiceCheckbox
          name="helicopter"
          label="Helicopter Ride"
          checked={form.helicopter}
          onChange={handleChange}
        />
        <ServiceCheckbox
          name="hotelUpgrade"
          label="Hotel Upgrade"
          checked={form.hotelUpgrade}
          onChange={handleChange}
        />
        <ServiceCheckbox
          name="nurseSupport"
          label="Nurse Support"
          checked={form.nurseSupport}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function ServiceCheckbox({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}