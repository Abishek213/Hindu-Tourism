import { useState, useEffect } from "react";

export default function AssignTeamForm({ bookingId, guideList = [], transportOptions = [], onAssign }) {
  const [formData, setFormData] = useState({
    bookingId: bookingId || "",
    guideId: "",
    transportType: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Demo data
  const guides = guideList.length > 0 ? guideList : [
    { id: "1", name: "Rajesh Kumar - Heritage Specialist" },
    { id: "2", name: "Priya Sharma - Adventure Guide" },
    { id: "3", name: "Amit Singh - Cultural Expert" },
    { id: "4", name: "Sunita Devi - Nature Guide" }
  ];

  const transports = transportOptions.length > 0 ? transportOptions : [
    { id: "1", type: "luxury-car", label: "Luxury Car - AC Vehicle" },
    { id: "2", type: "tempo-traveller", label: "Tempo Traveller - Group Transport" },
    { id: "3", type: "bus", label: "Tourist Bus - Large Groups" },
    { id: "4", type: "motorcycle", label: "Royal Enfield - Adventure Tours" }
  ];

  useEffect(() => {
    if (bookingId) {
      setFormData(prev => ({ ...prev, bookingId }));
    }
  }, [bookingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onAssign) {
        onAssign(formData);
      } else {
        alert('Team assigned successfully!');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const getFocusClasses = (fieldName) => {
    return focusedField === fieldName
      ? 'border-orange-400 shadow-lg shadow-orange-200/50 scale-105'
      : 'border-orange-200 hover:border-orange-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 flex items-center justify-center relative">
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-red-300 rounded-full opacity-25"></div>

      <div className="relative max-w-lg w-full mx-auto">
        {/* Main Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
          
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-5 text-center relative">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full mb-2">
              <span className="text-lg">👥</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Assign Guide & Transport
            </h2>
            
          </div>

          {/* Form Content */}
          <div className="p-5">
            <div className="space-y-4">
              
              {/* Booking ID Field */}
              {!bookingId && (
                <div>
                  <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Booking ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('bookingId')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium ${getFocusClasses('bookingId')}`}
                      placeholder="Enter booking reference"
                      required
                    />
                  
                  </div>
                </div>
              )}

              {/* Guide Selection */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Select Guide
                </label>
                <div className="relative">
                  <select
                    name="guideId"
                    value={formData.guideId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('guideId')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer ${getFocusClasses('guideId')}`}
                    required
                  >
                    <option value="">Choose your expert guide</option>
                    {guides.map((guide) => (
                      <option key={guide.id} value={guide.id}>
                        {guide.name}
                      </option>
                    ))}
                  </select>
                  
                </div>
              </div>

              {/* Transport Selection */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Select Transport
                </label>
                <div className="relative">
                  <select
                    name="transportType"
                    value={formData.transportType}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('transportType')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer ${getFocusClasses('transportType')}`}
                    required
                  >
                    <option value="">Choose your transport</option>
                    {transports.map((option) => (
                      <option key={option.id} value={option.type}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Additional Notes
                </label>
                <div className="relative">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('notes')}
                    onBlur={() => setFocusedField(null)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium resize-none ${getFocusClasses('notes')}`}
                    placeholder="Share any special requirements..."
                  />
                 
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-300/50 ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Assigning Team...</span>
                      </>
                    ) : (
                      <>
                      
                        <span>Assign Team</span>
                        
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
        </div>

        {/* Feature Cards */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-100 hover:scale-105 transition-transform duration-300">
            <div className="text-xl mb-1">🏆</div>
            <div className="text-xs font-semibold text-gray-700">Expert Guides</div>
            <div className="text-xs text-gray-500">Certified professionals</div>
          </div>
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-100 hover:scale-105 transition-transform duration-300">
            <div className="text-xl mb-1">🚗</div>
            <div className="text-xs font-semibold text-gray-700">Premium Transport</div>
            <div className="text-xs text-gray-500">Comfortable & safe</div>
          </div>
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-100 hover:scale-105 transition-transform duration-300">
            <div className="text-xl mb-1">⭐</div>
            <div className="text-xs font-semibold text-gray-700">5-Star Service</div>
            <div className="text-xs text-gray-500">Exceptional experience</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}