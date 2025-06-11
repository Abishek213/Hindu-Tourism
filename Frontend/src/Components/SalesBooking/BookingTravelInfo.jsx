function ServiceCheckbox({ service, checked, onChange }) {
  return (
    <label className="flex items-center p-3 space-x-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(service._id)}
        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{service.name}</span>
        <span className="text-xs text-gray-500">${service.price}</span>
        {service.description && (
          <span className="text-xs text-gray-400">{service.description}</span>
        )}
      </div>
    </label>
  );
}

function AdditionalServices({ servicesList = [], selectedServices = [], onServiceToggle }) {
  return (
    <div className="pt-4 mt-6 border-t border-gray-200">
      <h4 className="mb-4 font-medium text-gray-800 text-md">Additional Services</h4>
      {servicesList.length === 0 ? (
        <p className="text-sm text-gray-500">No additional services available</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {servicesList.map(service => (
            <ServiceCheckbox
              key={service._id}
              service={service}
              checked={selectedServices.includes(service._id)}
              onChange={onServiceToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TravelerCard({ 
  index, 
  traveler, 
  onChange, 
  errors,
  customerName 
}) {
  const handleDocumentTypeChange = (e) => {
    const newDocumentType = e.target.value;
    onChange(index, 'documentType', newDocumentType);
    
    onChange(index, 'documents', {
      passportFile: null,
      aadhaarFrontFile: null,
      aadhaarBackFile: null
    });
  };

  const isLeadTraveler = index === 0;

  return (
    <div className="w-full lg:w-[calc(50%-0.5rem)] mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          {isLeadTraveler ? "Lead Traveler" : `Traveler ${index + 1}`}
        </h4>
      </div>

      {/* Traveler Name */}
      <div className="mb-3">
        <label className="block mb-1 text-xs font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          placeholder="Enter traveler's full name"
          value={isLeadTraveler && customerName ? customerName : traveler.name} // Pre-fill for lead traveler
          onChange={(e) => onChange(index, 'name', e.target.value)}
          disabled={isLeadTraveler && customerName ? true : false} // Make read-only for lead traveler if name is provided
          className={`w-full p-2 text-sm border ${errors[`travelerName_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${isLeadTraveler && customerName ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {errors[`travelerName_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`travelerName_${index}`]}</p>}
      </div>

      {/* Document Type Selection */}
      <div className="mb-3">
        <label className="block mb-1 text-xs font-medium text-gray-700">Document Type</label>
        <select
          value={traveler.documentType}
          onChange={handleDocumentTypeChange}
          className={`w-full p-2 text-sm border ${errors[`documentType_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        >
          <option value="">Select Document Type</option>
          <option value="passport">Passport</option>
          <option value="aadhaar">Aadhaar Card</option>
        </select>
        {errors[`documentType_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`documentType_${index}`]}</p>}
      </div>

      {/* Document Upload Section */}
      {traveler.documentType && (
        <div className="grid grid-cols-1 gap-2">
          {traveler.documentType === 'passport' && (
            <DocumentUploader
              label="Passport"
              index={index}
              documentType="passportFile"
              traveler={traveler}
              onChange={onChange}
              errors={errors}
              errorKey={`passport_${index}`}
            />
          )}

          {traveler.documentType === 'aadhaar' && (
            <>
              <DocumentUploader
                label="Aadhaar Card Front"
                index={index}
                documentType="aadhaarFrontFile"
                traveler={traveler}
                onChange={onChange}
                errors={errors}
                errorKey={`aadhaarFront_${index}`}
              />

              <DocumentUploader
                label="Aadhaar Card Back"
                index={index}
                documentType="aadhaarBackFile"
                traveler={traveler}
                onChange={onChange}
                errors={errors}
                errorKey={`aadhaarBack_${index}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentUploader({ 
  label, 
  index, 
  documentType, 
  traveler, 
  onChange, 
  errors, 
  errorKey 
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(index, `documents.${documentType}`, file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label className={`flex flex-col items-center justify-center w-full h-20 border-2 ${errors[errorKey] ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}>
          <div className="flex flex-col items-center justify-center px-2 py-1 text-center">
            <svg className="w-5 h-5 mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            <p className="text-xs text-gray-500">Upload {label}</p>
          </div>
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange}
            className="hidden" 
          />
        </label>
      </div>
      {traveler.documents && traveler.documents[documentType] && (
        <p className="mt-1 text-xs text-green-600">
          ✓ {traveler.documents[documentType].name}
        </p>
      )}
      {errors[errorKey] && <p className="mt-1 text-xs text-red-500">{errors[errorKey]}</p>}
    </div>
  );
}

export default function TravelersInformation({ 
  travelersInfo, 
  errors, 
  onChange,
  servicesList = [],
  selectedServices = [],
  onServiceToggle = () => {},
   customer = null 
}) {
  return (
    <div className="pt-4 mt-6 border-t">
      <h3 className="mb-3 text-lg font-medium text-gray-800">Travelers Information</h3>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {travelersInfo.map((traveler, index) => (
          <TravelerCard 
            key={index}
            index={index}
            traveler={traveler}
            onChange={onChange}
            errors={errors}
          />
        ))}
      </div>

      <AdditionalServices
        servicesList={servicesList}
        selectedServices={selectedServices}
        onServiceToggle={onServiceToggle}
      />
    </div>
  );
}