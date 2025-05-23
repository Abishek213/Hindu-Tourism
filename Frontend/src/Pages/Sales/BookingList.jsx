import { useState } from 'react';
// Fix: Import from the correct context file that matches your App.jsx
import { useBookings } from '../../context/BookingContext';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, Calendar, Users, Download, Check, X, 
  ChevronDown, ChevronUp, FileImage, MapPin, 
  Phone, Mail, DollarSign, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateBookingPDF } from '../../Components/SalesBooking/Pdf';

export default function BookingList() {
  const { bookings, deleteBooking } = useBookings();
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [generatingPdfFor, setGeneratingPdfFor] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Calculate time since booking was created
  const getTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const toggleExpand = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const generatePDF = async (booking) => {
    setGeneratingPdfFor(booking.id);
    
    try {
      console.log('Generating PDF for booking:', booking);
      
      // Use our PDF utility function to generate the PDF
      const pdfData = await generateBookingPDF(booking);
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfData.dataUrl;
      downloadLink.download = pdfData.filename;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdfFor(null);
    }
  };

  // Get package badge color
  const getPackageBadgeColor = (packageType) => {
    switch(packageType) {
      case 'Premium':
        return 'bg-purple-50 text-purple-700';
      case 'Deluxe':
        return 'bg-indigo-50 text-indigo-700';
      case 'Exclusive':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Get destination badge color
  const getDestinationBadgeColor = (destination) => {
    switch(destination) {
      case 'Pashupatinath':
        return 'bg-orange-50 text-orange-700';
      case 'Muktinath':
        return 'bg-teal-50 text-teal-700';
      case 'Both':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Bookings</h2>
        <Link 
          to="/bookings/new" 
          className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          New Booking
        </Link>
      </div>

      <div className="p-6">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings have been created yet.</p>
            <Link 
              to="/bookings/new" 
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  onClick={() => toggleExpand(booking.id)}
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={18} className="text-gray-500" />
                    <h3 className="font-medium text-gray-800">{booking.leadId}</h3>
                    <span className="text-xs text-gray-500">{getTimeAgo(booking.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBooking(booking.id);
                      }}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X size={18} />
                    </button>
                    {expandedBooking === booking.id ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Basic information visible always */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Travel Period</p>
                        <p className="text-sm">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Travelers</p>
                        <p className="text-sm">{booking.travelers}</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 ${getPackageBadgeColor(booking.package)} text-xs rounded-full`}>
                          {booking.package || "No Package"}
                        </span>
                        
                        {booking.destination && (
                          <span className={`inline-flex items-center px-2 py-1 ${getDestinationBadgeColor(booking.destination)} text-xs rounded-full`}>
                            <MapPin size={12} className="mr-1" />
                            {booking.destination}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {booking.helicopter && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          <Check size={12} className="mr-1" /> Helicopter
                        </span>
                      )}
                      {booking.hotelUpgrade && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                          <Check size={12} className="mr-1" /> Hotel Upgrade
                        </span>
                      )}
                      {booking.nurseSupport && (
                        <span className="inline-flex items-center px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                          <Check size={12} className="mr-1" /> Nurse Support
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generatePDF(booking);
                      }}
                      disabled={generatingPdfFor === booking.id}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      {generatingPdfFor === booking.id ? (
                        <>
                          <span className="inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Extended details when expanded */}
                {expandedBooking === booking.id && (
                  <div className="px-2 pb-6 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Booking Details Column */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-4">Booking Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Guide</p>
                            <p className="text-sm">{booking.guide || 'Not assigned'}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500">Transport Team</p>
                            <p className="text-sm">{booking.transportTeam || 'Not assigned'}</p>
                          </div>
                          
                          <div className="flex items-start space-x-1">
                            <Phone size={14} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Contact</p>
                              <p className="text-sm">{booking.contactNumber || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-1">
                            <Mail size={14} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm truncate">{booking.email || booking.emailAddress || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-1">
                            <DollarSign size={14} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Advance Amount</p>
                              <p className="text-sm">₹{booking.advanceAmount || '0'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500">Booking ID</p>
                            <p className="text-sm font-mono text-xs">{booking.id}</p>
                          </div>
                          
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-sm">{new Date(booking.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Travelers Column */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-4">Travelers Information</h4>
                        <div className="space-y-4">
                          {booking.travelersInfo && booking.travelersInfo.map((traveler, index) => (
                            <div key={index} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                              <div className="flex items-center space-x-2 mb-2">
                                <UserCheck size={16} className="text-gray-500" />
                                <h5 className="text-sm font-medium">
                                  {index === 0 ? 'Lead Traveler' : `Traveler ${index + 1}`}: {traveler.name || 'N/A'}
                                </h5>
                              </div>
                              
                              {/* Document thumbnails */}
                              <div className="grid grid-cols-3 gap-2">
                                {/* Passport */}
                                <DocumentPreview 
                                  label="Passport"
                                  file={traveler.documents && traveler.documents.passportFile}
                                  leadId={booking.leadId}
                                  travelerIndex={index}
                                />
                                
                                {/* Aadhaar Front */}
                                <DocumentPreview 
                                  label="Aadhaar Front"
                                  file={traveler.documents && traveler.documents.aadhaarFrontFile}
                                  leadId={booking.leadId}
                                  travelerIndex={index}
                                />
                                
                                {/* Aadhaar Back */}
                                <DocumentPreview 
                                  label="Aadhaar Back"
                                  file={traveler.documents && traveler.documents.aadhaarBackFile}
                                  leadId={booking.leadId}
                                  travelerIndex={index}
                                />
                              </div>
                            </div>
                          ))}
                          
                          {(!booking.travelersInfo || booking.travelersInfo.length === 0) && (
                            <div className="text-sm text-gray-500">No travelers information available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for document preview
function DocumentPreview({ label, file, leadId, travelerIndex }) {
  if (!file) {
    return (
      <div className="h-20 border border-gray-200 rounded flex items-center justify-center bg-gray-100">
        <span className="text-xs text-gray-400">No {label}</span>
      </div>
    );
  }
  
  const fileName = `${label.toLowerCase()}-${leadId}-traveler${travelerIndex + 1}${file.name ? '.' + file.name.split('.').pop() : ''}`;
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="p-1 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <span className="text-xs font-medium truncate">{label}</span>
        <a 
          href={file.dataUrl} 
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          className="text-blue-600 hover:text-blue-800"
        >
          <Download size={12} />
        </a>
      </div>
      
      {file.dataUrl && file.type && file.type.startsWith('image/') ? (
        <div className="h-12 bg-gray-50 flex items-center justify-center p-1">
          <img 
            src={file.dataUrl} 
            alt={label} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="h-12 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center text-gray-500">
            <FileImage size={14} />
            <span className="text-xs mt-0.5 truncate max-w-full px-1">
              {file.name ? file.name.substring(0, 10) + (file.name.length > 10 ? '...' : '') : 'File'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}