import React, { useState, useEffect } from "react";
import { Compass, MapPin, CheckCircle, Clock, Route, ArrowRight } from "lucide-react";

// Define the available travel progress stages with icons and colors
const travelStages = [
  { 
    value: "Not Started", 
    label: "Not Started", 
    icon: Clock, 
    color: "text-gray-500",
    bgColor: "bg-gray-100"
  },
  { 
    value: "Trip Started", 
    label: "Trip Started", 
    icon: Route, 
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  },
  { 
    value: "En Route", 
    label: "En Route", 
    icon: ArrowRight, 
    color: "text-orange-500",
    bgColor: "bg-orange-100"
  },
  { 
    value: "Reached Destination", 
    label: "Reached Destination", 
    icon: MapPin, 
    color: "text-green-500",
    bgColor: "bg-green-100"
  },
  { 
    value: "Return Started", 
    label: "Return Started", 
    icon: ArrowRight, 
    color: "text-amber-500",
    bgColor: "bg-amber-100"
  },
  { 
    value: "Trip Completed", 
    label: "Trip Completed", 
    icon: CheckCircle, 
    color: "text-emerald-500",
    bgColor: "bg-emerald-100"
  },
];

const TravelProgressUpdater = ({ 
  initialBookingId = "HTL-2024-001", 
  currentStatus = "Not Started", 
  onUpdate = (data) => console.log('Status updated:', data)
}) => {
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (onUpdate && typeof onUpdate === "function") {
        onUpdate({ bookingId, status });
      }
      setIsUpdating(false);
    }, 1000);
  };

  const currentStage = travelStages.find(stage => stage.value === status);
  const currentStageIndex = travelStages.findIndex(stage => stage.value === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-3">
      <div className="max-w-xl mx-auto">
        {/* Header Section - Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-3 shadow-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-1">
            Travel Progress Tracker
          </h1>
          <p className="text-sm text-orange-600">Update journey status in real-time</p>
        </div>

        {/* Progress Visualization - More Compact */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 mb-4 p-4">
          <h3 className="text-base font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <Route className="w-4 h-4" />
            Journey Progress
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            {travelStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isActive = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              
              return (
                <React.Fragment key={stage.value}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-110' 
                        : isActive 
                        ? 'bg-orange-100 border-orange-300 text-orange-600' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <StageIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs mt-1 text-center max-w-12 leading-tight ${
                      isCurrent ? 'text-orange-600 font-semibold' : 'text-gray-500'
                    }`}>
                      {stage.label.split(' ')[0]}
                    </span>
                  </div>
                  
                  {index < travelStages.length - 1 && (
                    <div className="flex items-center justify-center flex-1 mx-1">
                      <div className="relative flex-1 h-4 flex items-center">
                        {/* Road path with dashed lines */}
                        <div className={`w-full h-2 rounded-full relative transition-all duration-300 ${
                          index < currentStageIndex ? 'bg-orange-200' : 'bg-gray-200'
                        }`}>
                          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            index < currentStageIndex 
                              ? 'bg-gradient-to-r from-orange-300 to-orange-400' 
                              : 'bg-gray-200'
                          }`}></div>
                          {/* Road lane markings */}
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2">
                            <div className={`h-full transition-all duration-300 ${
                              index < currentStageIndex ? 'bg-white/60' : 'bg-gray-300'
                            }`} 
                            style={{
                              backgroundImage: index < currentStageIndex 
                                ? 'repeating-linear-gradient(to right, white 0px, white 3px, transparent 3px, transparent 8px)'
                                : 'repeating-linear-gradient(to right, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Update Form - Compact */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Update Travel Status
            </h2>
            <p className="text-orange-100 text-sm mt-1">Keep passengers and team informed</p>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {/* Booking ID Input - Now Editable */}
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">
                  Booking Reference
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Enter booking ID"
                    className="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-lg font-mono text-orange-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Current Status Display - Compact */}
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <label className="block text-sm font-semibold text-orange-800 mb-2">
                  Current Status
                </label>
                <div className="flex items-center gap-2">
                  {currentStage && (
                    <>
                      <div className={`w-6 h-6 rounded-full ${currentStage.bgColor} flex items-center justify-center`}>
                        <currentStage.icon className={`w-3 h-3 ${currentStage.color}`} />
                      </div>
                      <span className="text-sm font-medium text-orange-800">{currentStage.label}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Selection - Compact */}
              <div>
                <label className="block text-sm font-semibold text-orange-800 mb-2">
                  Update to New Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 cursor-pointer"
                >
                  {travelStages.map((stage, index) => (
                    <option key={index} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button - Compact */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUpdating || (status === currentStatus && bookingId === initialBookingId)}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isUpdating || (status === currentStatus && bookingId === initialBookingId)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (status === currentStatus && bookingId === initialBookingId) ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Up to Date
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="text-center mt-4">
          <p className="text-xs text-orange-600">Hindu Travels CRM • Real-time Journey Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default TravelProgressUpdater;