import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BookingDetails from './BookingFormDetails';
import TravelersInformation from './BookingTravelInfo';
import api from '../../api/auth';

export default function BookingFormOverlay({ isOpen, onClose, onSubmitted, customer }) {

  const [form, setForm] = useState({
    destination: '',
    package: '',
    travelers: 1,
    startDate: '',
    endDate: '',
    helicopter: false,
    hotelUpgrade: false,
    nurseSupport: false
  });
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/package', {
          params: { is_active: true }
        });
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  // Travelers information state
  const [travelersInfo, setTravelersInfo] = useState([
    {
      name: '',
      documentType: '',
      documents: {
        passportFile: null,
        aadhaarFrontFile: null,
        aadhaarBackFile: null
      }
    }
  ]);

  // Errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
 const handleFormChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  setForm(prev => {
    const newForm = {
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    };

    // If package changes, validate destination
    if (name === 'package' && value) {
      const selectedPackage = packages.find(pkg => pkg._id === value);
      if (selectedPackage) {
        // Reset destination if it's not allowed for the new package
        if (!selectedPackage.destination.includes(newForm.destination)) {
          newForm.destination = selectedPackage.destination[0]; // Set to first allowed destination
        }
      }
    }

    return newForm;
  });

  // Clear related errors
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  // Handle travelers count change and update travelers array
  const handleTravelersChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setForm(prev => ({ ...prev, travelers: count }));

    // Update travelers info array
    setTravelersInfo(prev => {
      const newTravelersInfo = [...prev];

      if (count > prev.length) {
        // Add new travelers
        for (let i = prev.length; i < count; i++) {
          newTravelersInfo.push({
            name: '',
            documentType: '',
            documents: {
              passportFile: null,
              aadhaarFrontFile: null,
              aadhaarBackFile: null
            }
          });
        }
      } else if (count < prev.length) {
        // Remove excess travelers
        newTravelersInfo.splice(count);
      }

      return newTravelersInfo;
    });

    // Clear travelers-related errors
    if (errors.travelers) {
      setErrors(prev => ({ ...prev, travelers: '' }));
    }
  };

  // Handle traveler information changes
  const handleTravelerChange = (index, field, value) => {
    setTravelersInfo(prev => {
      const updated = [...prev];

      if (field.includes('.')) {
        // Handle nested properties like 'documents.passportFile'
        const [parentField, childField] = field.split('.');
        updated[index] = {
          ...updated[index],
          [parentField]: {
            ...updated[index][parentField],
            [childField]: value
          }
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }

      return updated;
    });

    // Clear related errors
    const errorKey = field.includes('.') ?
      `${field.split('.')[1]}_${index}` :
      `${field}_${index}`;

    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate basic form fields
    if (!form.destination) newErrors.destination = 'Destination is required';
    if (!form.package) newErrors.package = 'Package is required';
    if (!form.travelers || form.travelers < 1) newErrors.travelers = 'At least 1 traveler is required';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate) newErrors.endDate = 'End date is required';

    // Validate date logic
    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate travelers information
    travelersInfo.forEach((traveler, index) => {
      if (!traveler.name.trim()) {
        newErrors[`travelerName_${index}`] = 'Traveler name is required';
      }

      if (!traveler.documentType) {
        newErrors[`documentType_${index}`] = 'Document type is required';
      }

      // Validate document uploads based on type
      if (traveler.documentType === 'passport') {
        if (!traveler.documents.passportFile) {
          newErrors[`passport_${index}`] = 'Passport document is required';
        }
      } else if (traveler.documentType === 'aadhaar') {
        if (!traveler.documents.aadhaarFrontFile) {
          newErrors[`aadhaarFront_${index}`] = 'Aadhaar front document is required';
        }
        if (!traveler.documents.aadhaarBackFile) {
          newErrors[`aadhaarBack_${index}`] = 'Aadhaar back document is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packages.some(pkg => pkg._id === form.package)) {
      setErrors("Please select a valid package");
      return;
    }
    console.log("Submitting:", form);


    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add customer information
      if (customer) {
        formData.append('package_id', String(form.package)); // Key must match backend
        formData.append('destination', form.destination);
        formData.append('customer_id', customer._id || customer.id);
        formData.append('customerName', customer.name);
        formData.append('customerEmail', customer.email);
        formData.append('customerPhone', customer.phone);
      }

      // Add form data
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // Add travelers information
      travelersInfo.forEach((traveler, index) => {
        formData.append(`travelers[${index}][name]`, traveler.name);
        formData.append(`travelers[${index}][documentType]`, traveler.documentType);

        if (traveler.documents.passportFile) {
          formData.append(`travelers[${index}][passport]`, traveler.documents.passportFile);
        }
        if (traveler.documents.aadhaarFrontFile) {
          formData.append(`travelers[${index}][aadhaarFront]`, traveler.documents.aadhaarFrontFile);
        }
        if (traveler.documents.aadhaarBackFile) {
          formData.append(`travelers[${index}][aadhaarBack]`, traveler.documents.aadhaarBackFile);
        }
      });

      // Make the API call with proper headers
      const response = await api.post('/booking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle successful response (Axios uses response.status)
      if (response.status === 200 || response.status === 201) {
        alert('Booking submitted successfully!');

        if (onSubmitted) {
          onSubmitted(response.data); // Axios stores data in response.data
        }

        resetForm();
        onClose();
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setForm({
      destination: '',
      package: '',
      travelers: 1,
      startDate: '',
      endDate: '',
      helicopter: false,
      hotelUpgrade: false,
      nurseSupport: false
    });
    setTravelersInfo([
      {
        name: '',
        documentType: '',
        documents: {
          passportFile: null,
          aadhaarFrontFile: null,
          aadhaarBackFile: null
        }
      }
    ]);
    setErrors({});
  };

  // Handle overlay close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 rounded-t-lg bg-gradient-to-r from-orange-500 to-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Book Your Journey</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-white transition-colors duration-150 rounded-full hover:text-orange-200 hover:bg-white hover:bg-opacity-20"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information Display */}
            {customer && (
              <div className="p-4 border border-orange-200 rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Customer Information</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <span className="font-medium text-gray-700">Name: </span>
                    <span className="text-gray-900">{customer.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email: </span>
                    <span className="text-gray-900">{customer.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone: </span>
                    <span className="text-gray-900">{customer.phone}</span>
                  </div>
                </div>
              </div>
            )}


            {/* Booking Details Section */}
            <BookingDetails
              form={form}
              errors={errors}
              onChange={handleFormChange}
              onTravelersChange={handleTravelersChange}
              packages={packages}
            />

            {/* Travelers Information Section */}
            {form.travelers > 0 && (
              <TravelersInformation
                travelersInfo={travelersInfo}
                errors={errors}
                onChange={handleTravelerChange}
                form={form}
                onFormChange={handleFormChange}
              />
            )}

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="pl-5 space-y-1 list-disc">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="sticky bottom-0 flex items-center justify-between pt-6 bg-white border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}