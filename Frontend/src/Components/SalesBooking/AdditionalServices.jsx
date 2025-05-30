// AdditionalServices.jsx
export default function AdditionalServices({ form, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-gray-800">Additional Services</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ServiceCheckbox
          name="helicopter"
          label="Helicopter Ride"
          checked={form.helicopter}
          onChange={onChange}
        />
        <ServiceCheckbox
          name="hotelUpgrade"
          label="Hotel Upgrade"
          checked={form.hotelUpgrade}
          onChange={onChange}
        />
        <ServiceCheckbox
          name="nurseSupport"
          label="Nurse Support"
          checked={form.nurseSupport}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function ServiceCheckbox({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center p-3 space-x-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}