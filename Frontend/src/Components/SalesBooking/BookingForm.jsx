import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BookingDetails from './BookingFormDetail';
import TravelersInformation from './BookingTravelInfo';
import api from '../../api/auth';

export default function BookingFormOverlay({ isOpen = true, onClose, onSubmitted, customer }) {
  const [form, setForm] = useState({
    destination: '',
    packageId: '', 
    travelers: 1,
    startDate: '',
    endDate: '',
    helicopter: false,
    hotelUpgrade: false,
    nurseSupport: false,
    packageType: 'Deluxe'
  });
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [servicesList, setServicesList] = useState([]); // State to store fetched services

  // State for custom alerts/modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Effect to fetch packages and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packageResponse = await api.get('/package', {
          params: { is_active: true }
        });
        setPackages(packageResponse.data);

        // Extract unique destinations from package titles
        const uniqueDestinations = [...new Set(packageResponse.data.map(pkg => pkg.title))];
        setDestinations(uniqueDestinations);

        // Fetch services
        // const serviceResponse = await api.get('/service'); // Assuming a /service endpoint
        // setServicesList(serviceResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setModalMessage('Failed to load form data. Please try again later.');
        setShowErrorModal(true);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Effect to set packageId when destination changes
  useEffect(() => {
    if (form.destination && packages.length > 0) {
      const matched = packages.find(pkg => pkg.title === form.destination);
      if (matched) {
        setForm(prev => ({ ...prev, packageId: matched._id }));
      } else {
        setForm(prev => ({ ...prev, packageId: '' }));
      }
    }
  }, [form.destination, packages]);

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

      // Reset packageId when destination changes to ensure re-matching
      if (name === 'destination') {
        newForm.packageId = '';
      }

      return newForm;
    });

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
    if (!form.packageId) newErrors.packageId = 'A valid package must be selected for the destination.';
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

    if (!validateForm()) {
      setModalMessage('Please correct the errors in the form.');
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // --- Step 1: Create the Booking ---
      const bookingFormData = new FormData();
      bookingFormData.append('customer_id', customer._id || customer.id);
      bookingFormData.append('package_id', form.packageId);
      bookingFormData.append('package_type', form.packageType);
      bookingFormData.append('travel_start_date', form.startDate);
      bookingFormData.append('travel_end_date', form.endDate);
      bookingFormData.append('num_travelers', form.travelers);

      const services = [];
      if (form.helicopter) {
        const service = servicesList.find(s => s.name === 'Helicopter Ride');
        if (service) services.push({ service_id: service._id, price_applied: service.price });
      }
      if (form.hotelUpgrade) {
        const service = servicesList.find(s => s.name === 'Hotel Upgrade');
        if (service) services.push({ service_id: service._id, price_applied: service.price });
      }
      if (form.nurseSupport) {
        const service = servicesList.find(s => s.name === 'Nurse Support');
        if (service) services.push({ service_id: service._id, price_applied: service.price });
      }

      if (services.length > 0) {
        bookingFormData.append('services', JSON.stringify(services));
      }

      const bookingResponse = await api.post('/booking', bookingFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (bookingResponse.status === 200 || bookingResponse.status === 201) {
        const bookingId = bookingResponse.data.booking._id;

        // --- Step 2: Upload Documents for Travelers ---
        const documentsToUpload = [];
        const filesToAttach = new FormData(); // Use a separate FormData for files

        travelersInfo.forEach((traveler, index) => {
          const isMainCustomer = index === 0; // First traveler is the main customer
          const travelerName = traveler.name.trim();

          if (traveler.documentType === 'passport' && traveler.documents.passportFile) {
            documentsToUpload.push({
              document_type: 'Passport',
              traveler_name: travelerName,
              is_main_customer: isMainCustomer,
              customer_id: isMainCustomer ? (customer._id || customer.id) : undefined,

            });
            filesToAttach.append('files', traveler.documents.passportFile);
          } else if (traveler.documentType === 'aadhaar') {
            if (traveler.documents.aadhaarFrontFile) {
              documentsToUpload.push({
                document_type: 'Aadhaar Card', // Changed to match backend enum: 'Aadhaar Card'
                traveler_name: travelerName,
                is_main_customer: isMainCustomer,
                customer_id: isMainCustomer ? (customer._id || customer.id) : undefined,
              });
              filesToAttach.append('files', traveler.documents.aadhaarFrontFile);
            }
            if (traveler.documents.aadhaarBackFile) {
              documentsToUpload.push({
                document_type: 'Aadhaar Card',
                traveler_name: travelerName,
                is_main_customer: isMainCustomer,
                customer_id: isMainCustomer ? (customer._id || customer.id) : undefined,
              });
              filesToAttach.append('files', traveler.documents.aadhaarBackFile);
            }
          }

        });

        if (documentsToUpload.length > 0) {
          
          filesToAttach.append('documents', JSON.stringify(documentsToUpload)); // Append metadata as JSON string

          const documentUploadResponse = await api.post(`/document/bookings/${bookingId}`, filesToAttach, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (documentUploadResponse.status !== 200 && documentUploadResponse.status !== 201) {
            console.warn("Documents upload failed:", documentUploadResponse.data);
          }
        }
        setModalMessage('Booking submitted successfully and documents uploaded!');
        setShowSuccessModal(true);

        if (onSubmitted) {
          onSubmitted(bookingResponse.data);
        }

        resetForm();
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
    } 
  
  };

  // Reset form function
  const resetForm = () => {
    setForm({
      destination: '',
      packageId: '',
      travelers: 1,
      startDate: '',
      endDate: '',
      helicopter: false,
      hotelUpgrade: false,
      nurseSupport: false,
      packageType: 'Deluxe'
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
              destinations={destinations}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-green-700">Success!</h3>
            <p className="mb-6 text-gray-700">{modalMessage}</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setModalMessage('');
                onClose(); // Close the main form after success
              }}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-red-700">Error!</h3>
            <p className="mb-6 text-gray-700">{modalMessage}</p>
            <button
              onClick={() => {
                setShowErrorModal(false);
                setModalMessage('');
              }}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}