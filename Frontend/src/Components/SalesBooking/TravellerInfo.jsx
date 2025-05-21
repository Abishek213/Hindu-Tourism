// components/TravelersInformation.jsx
import { User } from 'lucide-react';

export default function TravelersInformation({ 
  travelersInfo, 
  handleTravelerNameChange, 
  handleFileChange, 
  errors 
}) {
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Travelers Information</h3>
      
      <div className="flex flex-wrap gap-4">
        {travelersInfo.map((traveler, index) => (
          <TravelerCard 
            key={index}
            index={index}
            traveler={traveler}
            handleTravelerNameChange={handleTravelerNameChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}

function TravelerCard({ 
  index, 
  traveler, 
  handleTravelerNameChange, 
  handleFileChange, 
  errors 
}) {
  return (
    <div className="w-[calc(50%-0.5rem)] mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          {index === 0 ? "Lead Traveler" : `Traveler ${index + 1}`}
        </h4>
        <User size={16} className="text-gray-500" />
      </div>
      
      {/* Traveler Name */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1"></label>
        <input
          type="text"
          placeholder="Enter traveler's full name"
          value={traveler.name}
          onChange={(e) => handleTravelerNameChange(index, e.target.value)}
          aria-invalid={errors[`travelerName_${index}`] ? "true" : "false"}
          className={`w-full p-1.5 text-sm border ${errors[`travelerName_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors[`travelerName_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`travelerName_${index}`]}</p>}
      </div>
      
      {/* Document Upload Section */}
      <div className="grid grid-cols-3 gap-2">
        <DocumentUploader 
          label="Passport"
          index={index}
          documentType="passportFile"
          traveler={traveler}
          handleFileChange={handleFileChange}
          errors={errors}
          errorKey={`passport_${index}`}
        />

        <DocumentUploader 
          label="AdharCard Front"
          index={index}
          documentType="aadhaarFrontFile"
          traveler={traveler}
          handleFileChange={handleFileChange}
          errors={errors}
          errorKey={`aadhaarFront_${index}`}
        />

        <DocumentUploader 
          label="AdharCard Back"
          index={index}
          documentType="aadhaarBackFile"
          traveler={traveler}
          handleFileChange={handleFileChange}
          errors={errors}
          errorKey={`aadhaarBack_${index}`}
        />
      </div>
    </div>
  );
}

function DocumentUploader({ 
  label, 
  index, 
  documentType, 
  traveler, 
  handleFileChange, 
  errors, 
  errorKey 
}) {
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label className={`flex flex-col items-center justify-center w-full h-20 border-2 ${errors[errorKey] ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}>
          <div className="flex flex-col items-center justify-center py-1 px-2 text-center">
            <svg className="w-5 h-5 mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={(e) => handleFileChange(index, documentType, e)}
            aria-invalid={errors[errorKey] ? "true" : "false"}
            className="hidden" 
          />
        </label>
      </div>
      {traveler.documents[documentType] && (
        <p className="mt-1 text-xs text-green-600 truncate">
          ✓ Uploaded
        </p>
      )}
      {errors[errorKey] && <p className="mt-1 text-xs text-red-500">{errors[errorKey]}</p>}
    </div>
  );
}