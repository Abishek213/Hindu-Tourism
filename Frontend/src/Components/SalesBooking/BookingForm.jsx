import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import AdditionalServices from './AdditionalServices';
import BookingDetails from './Bookingdetails';
import TravelersInformation from './TravellerInfo';
import { useBookings} from '../../context/BookingContext';

export default function BookingFormOverlay({ isOpen = true, onClose, onSubmitted }) {
  // Use the actual context hook instead of the mock
  const { addBooking } = useBookings();
  
  const [form, setForm] = useState({
    package: '',
    travelers: 1,
    advanceAmount: '',
    startDate: '',
    endDate: '',
    destination: '',
    helicopter: false,
    hotelUpgrade: false,
    nurseSupport: false
  });

  // State for travelers info
  const [travelersInfo, setTravelersInfo] = useState([
    {
      name: '', // Lead traveler
      isLead: true,
      documentType: '', // 'passport' or 'aadhaar'
      documents: {
        passportFile: null,
        aadhaarFrontFile: null,
        aadhaarBackFile: null
      }
    }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update number of travelers
  const handleTravelersChange = (e) => {
    const newCount = parseInt(e.target.value) || 1;
    setForm({
      ...form,
      travelers: newCount
    });

    // Adjust travelers info array
    if (newCount > travelersInfo.length) {
      // Add new travelers
      const newTravelers = [...travelersInfo];
      for (let i = travelersInfo.length; i < newCount; i++) {
        newTravelers.push({
          name: '',
          isLead: false,
          documentType: '',
          documents: {
            passportFile: null,
            aadhaarFrontFile: null,
            aadhaarBackFile: null
          }
        });
      }
      setTravelersInfo(newTravelers);
    } else if (newCount < travelersInfo.length) {
      // Remove excess travelers, but keep the lead
      setTravelersInfo(travelersInfo.slice(0, newCount));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!form.package) newErrors.package = "Package is required";
    if (!form.advanceAmount.trim()) newErrors.advanceAmount = "Advance amount is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.destination) newErrors.destination = "Destination is required";
    
    // Advance amount validation
    if (form.advanceAmount && (isNaN(parseFloat(form.advanceAmount)) || parseFloat(form.advanceAmount) <= 0)) {
      newErrors.advanceAmount = "Please enter a valid positive amount";
    }
    
    // Date validation
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }
      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }
    
    // Validate traveler info
    travelersInfo.forEach((traveler, index) => {
      // Name validation for each traveler
      if (!traveler.name.trim()) {
        newErrors[`travelerName_${index}`] = `Traveler ${index + 1} name is required`;
      }
      
      // Document type validation
      if (!traveler.documentType) {
        newErrors[`documentType_${index}`] = `Document type is required for traveler ${index + 1}`;
      }
      
      // Document file validation based on selected type
      if (traveler.documentType === 'passport') {
        if (!traveler.documents.passportFile) {
          newErrors[`passport_${index}`] = `Passport document is required for traveler ${index + 1}`;
        }
      } else if (traveler.documentType === 'aadhaar') {
        if (!traveler.documents.aadhaarFrontFile) {
          newErrors[`aadhaarFront_${index}`] = `Aadhaar front is required for traveler ${index + 1}`;
        }
        if (!traveler.documents.aadhaarBackFile) {
          newErrors[`aadhaarBack_${index}`] = `Aadhaar back is required for traveler ${index + 1}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTravelerInfoChange = (index, field, value) => {
    const updatedTravelers = [...travelersInfo];
    
    if (field === 'documents') {
      // Handle complete documents object replacement
      updatedTravelers[index].documents = value;
    } else if (field.includes('documents.')) {
      const docField = field.split('.')[1];
      updatedTravelers[index].documents[docField] = value;
    } else {
      updatedTravelers[index][field] = value;
    }
    
    setTravelersInfo(updatedTravelers);
    
    // Clear related errors
    const errorKey = field === 'name' ? `travelerName_${index}` : 
                    field === 'documentType' ? `documentType_${index}` :
                    field === 'documents.passportFile' ? `passport_${index}` :
                    field === 'documents.aadhaarFrontFile' ? `aadhaarFront_${index}` :
                    field === 'documents.aadhaarBackFile' ? `aadhaarBack_${index}` : null;
    
    if (errorKey && errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-300, .text-red-600');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create booking object with all necessary fields
      const bookingData = {
        id: Date.now().toString(),
        package: form.package,
        travelers: form.travelers,
        advanceAmount: parseFloat(form.advanceAmount),
        startDate: form.startDate,
        endDate: form.endDate,
        destination: form.destination.trim(),
        helicopter: form.helicopter,
        hotelUpgrade: form.hotelUpgrade,
        nurseSupport: form.nurseSupport,
        travelersInfo: travelersInfo,
        bookingDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };
      
      console.log('Creating booking:', bookingData);
      
      // Add booking to context - this should now work properly
      addBooking(bookingData);
      
      setSubmitted(true);
      
      // Call onSubmitted callback and close form after delay
      setTimeout(() => {
        if (onSubmitted) {
          onSubmitted(bookingData);
        }
        resetForm();
        if (onClose) {
          onClose();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      package: '',
      travelers: 1,
      advanceAmount: '',
      startDate: '',
      endDate: '',
      destination: '',
      helicopter: false,
      hotelUpgrade: false,
      nurseSupport: false
    });
    
    setTravelersInfo([
      {
        name: '',
        isLead: true,
        documentType: '',
        documents: {
          passportFile: null,
          aadhaarFrontFile: null,
          aadhaarBackFile: null
        }
      }
    ]);
    
    setSubmitted(false);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="mb-6 text-gray-600">
            Your booking has been successfully created and confirmed.
          </p>
          <div className="text-sm text-gray-500">
            Closing automatically...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500">
          <h1 className="text-xl font-bold text-white">New Booking</h1>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white transition-colors hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Show errors summary if any */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="mb-2 font-medium text-red-800">Please fix the following errors:</h3>
                <ul className="space-y-1 text-sm text-red-600">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Details Section */}
            <BookingDetails
              form={form}
              errors={errors}
              onChange={handleChange}
              onTravelersChange={handleTravelersChange}
            />

            {/* Travelers Information Section */}
            <TravelersInformation
              travelersInfo={travelersInfo}
              errors={errors}
              onChange={handleTravelerInfoChange}
            />

            {/* Additional Services Section */}
            <AdditionalServices
              form={form}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="sticky bottom-0 px-6 py-4 bg-white border-t">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-3 text-lg font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Booking...' : 'Submit Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}