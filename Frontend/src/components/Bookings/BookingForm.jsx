import { useState } from 'react';
import { Download, X, CheckCircle } from 'lucide-react';

export default function BookingForm() {
  const [form, setForm] = useState({
    leadId: '',
    package: '',
    travelers: 1,
    startDate: '',
    endDate: '',
    guide: '',
    transportTeam: '',
    passportFile: null,
    aadhaarFile: null,
    helicopter: false,
    hotelUpgrade: false,
    nurseSupport: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({
      ...form,
      [name]: files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const generatePDF = () => {
    setIsDownloading(true);
    
    // Simulate PDF generation and download
    setTimeout(() => {
      // In a real implementation, you would use jsPDF or another library
      // to generate the PDF file here
      
      const downloadLink = document.createElement('a');
      
      // This is a placeholder - in reality you would create a data URL or blob
      // from your PDF content
      const dummyPdfData = "data:application/pdf;base64,JVBERi0xLjMKJf////8KMTAgMCBvYmoKPDwKL1R5cGUgL0V4dEdTdGF0ZQovY2EgMQo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL1R5cGUgL0V4dEdTdGF0ZQovY2EgMQo+PgplbmRvYmo=";
      
      downloadLink.href = dummyPdfData;
      downloadLink.download = `booking-${form.leadId}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setIsDownloading(false);
      
      // Close the form after download
      setTimeout(() => {
        setShowForm(false);
      }, 500);
    }, 1500);
  };

  if (!showForm) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center gap-4">
          <CheckCircle size={64} className="text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">Booking Completed!</h2>
          <p className="text-gray-600">Your booking has been successfully submitted and downloaded.</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">New Booking</h2>
        <button 
          onClick={() => setShowForm(false)}
          className="text-white hover:bg-red-700 rounded-full p-1"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID/Name</label>
            <input
              type="text"
              name="leadId"
              placeholder="Enter lead ID or client name"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
            <select
              name="package"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Package</option>
              <option value="Pashupatinath">Pashupatinath</option>
              <option value="Muktinath">Muktinath</option>
              <option value="Both">Pashupatinath + Muktinath</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
            <input
              type="number"
              name="travelers"
              min="1"
              placeholder="Enter number"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guide</label>
            <input
              type="text"
              name="guide"
              placeholder="Assign a guide"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Team</label>
            <input
              type="text"
              name="transportTeam"
              placeholder="Assign transport team"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Download className="w-8 h-8 mb-1 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">Upload passport scan</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  name="passportFile" 
                  onChange={handleFileChange}
                  required
                  className="hidden" 
                />
              </label>
            </div>
            {form.passportFile && (
              <p className="mt-1 text-xs text-green-600">
                {form.passportFile.name} uploaded
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Download className="w-8 h-8 mb-1 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">Upload Aadhaar scan</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  name="aadhaarFile" 
                  onChange={handleFileChange}
                  required
                  className="hidden" 
                />
              </label>
            </div>
            {form.aadhaarFile && (
              <p className="mt-1 text-xs text-green-600">
                {form.aadhaarFile.name} uploaded
              </p>
            )}
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                name="helicopter"
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Helicopter Ride</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                name="hotelUpgrade"
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Hotel Upgrade</span>
            </label>
            <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                name="nurseSupport"
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Nurse Support</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          {!submitted ? (
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit Booking
            </button>
          ) : (
            <button
              type="button"
              onClick={generatePDF}
              disabled={isDownloading}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Booking PDF
                </>
              )}
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-sm text-green-700">
                Booking submitted successfully! Please download the PDF document.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}