// BookingForm.jsx 
import { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import BookingDetails from './Bookingdetails';
import TravelersInformation from './TravellerInfo';
import AdditionalServices from './AdditionalServices';
import SuccessScreen from './SuccessScreen';



export default function BookingForm() {
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  
  // Company guide options
  const guideOptions = [
    "Rajesh Sharma",
    "Priya Patel",
    "Amit Singh",
    "Neha Verma",
    "Vikram Desai",
    "Deepika Gupta"
  ];
  
  // Transport team options
  const transportTeamOptions = [
    "Team Alpha",
    "Team Bravo",
    "Team Delta",
    "Team Echo",
    "Team Foxtrot",
    "Team Kilo"
  ];
  
  const [form, setForm] = useState({
    leadId: '',
    package: '',
    travelers: 1,
    contactNumber: '',
    emailAddress: '',
    advanceAmount: '',
    startDate: '',
    endDate: '',
    guide: '',
    transportTeam: '',
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
      documents: {
        passportFile: null,
        aadhaarFrontFile: null,
        aadhaarBackFile: null
      }
    }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
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
    if (!form.leadId.trim()) newErrors.leadId = "Lead ID/Name is required";
    if (!form.package) newErrors.package = "Package is required";
    if (!form.emailAddress) newErrors.emailAddress = "Email is required";
    if (!form.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!form.advanceAmount.trim()) newErrors.advanceAmount = "Advance amount is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.guide.trim()) newErrors.guide = "Guide name is required";
    if (!form.transportTeam.trim()) newErrors.transportTeam = "Transport team is required";
    
    // Contact number validation
    if (form.contactNumber && !/^\d{10}$/.test(form.contactNumber.trim())) {
      newErrors.contactNumber = "Please enter a valid 10-digit contact number";
    }
    
    // Advance amount validation
    if (form.advanceAmount && isNaN(parseFloat(form.advanceAmount))) {
      newErrors.advanceAmount = "Please enter a valid amount";
    }
    
    // Date validation
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }
    
    // Validate traveler info
    travelersInfo.forEach((traveler, index) => {
      // Name validation for each traveler
      if (!traveler.name.trim()) {
        newErrors[`travelerName_${index}`] = "Traveler name is required";
      }

      // Document validation for each traveler
      if (!traveler.documents.passportFile) {
        newErrors[`passport_${index}`] = "Passport file is required";
      }
      if (!traveler.documents.aadhaarFrontFile) {
        newErrors[`aadhaarFront_${index}`] = "Aadhaar front file is required";
      }
      if (!traveler.documents.aadhaarBackFile) {
        newErrors[`aadhaarBack_${index}`] = "Aadhaar back file is required";
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
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Handle traveler name change
  const handleTravelerNameChange = (index, value) => {
    const updatedTravelers = [...travelersInfo];
    updatedTravelers[index].name = value;
    setTravelersInfo(updatedTravelers);
    
    // Clear error
    if (errors[`travelerName_${index}`]) {
      setErrors({
        ...errors,
        [`travelerName_${index}`]: undefined
      });
    }
  };

  const handleFileChange = (travelerIndex, documentType, e) => {
    const { files } = e.target;
    if (files[0]) {
      // Store both file name and a data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedTravelers = [...travelersInfo];
        updatedTravelers[travelerIndex].documents[documentType] = {
          name: files[0].name,
          type: files[0].type,
          dataUrl: event.target.result
        };
        setTravelersInfo(updatedTravelers);
        
        // Clear error for this field
        let errorKey;
        switch (documentType) {
          case 'passportFile':
            errorKey = `passport_${travelerIndex}`;
            break;
          case 'aadhaarFrontFile':
            errorKey = `aadhaarFront_${travelerIndex}`;
            break;
          case 'aadhaarBackFile':
            errorKey = `aadhaarBack_${travelerIndex}`;
            break;
        }
        
        if (errorKey && errors[errorKey]) {
          setErrors({
            ...errors,
            [errorKey]: undefined
          });
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }
    
    // Create a booking object for storage with all form data
    const bookingData = {
      leadId: form.leadId,
      email: form.emailAddress,
      package: form.package,
      travelers: form.travelers,
      contactNumber: form.contactNumber,
      advanceAmount: form.advanceAmount,
      startDate: form.startDate,
      endDate: form.endDate,
      guide: form.guide,
      transportTeam: form.transportTeam,
      destination: form.destination,
      travelersInfo: travelersInfo,
      helicopter: form.helicopter,
      hotelUpgrade: form.hotelUpgrade,
      nurseSupport: form.nurseSupport
    };
    
    // Add the booking to our context
    addBooking(bookingData);
    setSubmitted(true);
    
    // Navigate to booking list after short delay
    navigate('');
  };

  if (!showForm) {
    return <SuccessScreen onNewBooking={() => setShowForm(true)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">New Booking</h2>
        <button 
          onClick={() => navigate('/salesdashboard')}
          className="text-white hover:bg-red-700 rounded-full p-1"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-4">
        <BookingDetails 
          form={form}
          errors={errors}
          handleChange={handleChange}
          handleTravelersChange={handleTravelersChange}
          guideOptions={guideOptions}
          transportTeamOptions={transportTeamOptions}
        />

        <TravelersInformation 
          travelersInfo={travelersInfo}
          handleTravelerNameChange={handleTravelerNameChange}
          handleFileChange={handleFileChange}
          errors={errors}
        />

        <AdditionalServices 
          form={form}
          handleChange={handleChange}
        />

        <div className="mt-4 flex justify-end">
          <button 
            type="submit" 
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Submit Booking
          </button>
        </div>

        {submitted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-sm text-green-700">
                Booking submitted successfully! Redirecting to booking list...
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}