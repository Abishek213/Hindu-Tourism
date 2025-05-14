import { useState, useEffect } from 'react';
import { Download, Camera, Users, Map, Wind } from 'lucide-react';

export default function AddLeadForm() {
  const [form, setForm] = useState({
    fullName: '',
    nationality: '',
    phone: '',
    destination: '',
    packageType: '',
    numPeople: 1,
    transport: '',
    idImage: null,
    imagePreview: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [formClosed, setFormClosed] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch countries list for the dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        // Array of countries (simplified version)
        const countriesList = [
          "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
          "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
          "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
          "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
          "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
          "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
          "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", 
          "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
          "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", 
          "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
          "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
          "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
          "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
          "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
          "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
          "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
          "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
          "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
          "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
          "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", 
          "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
          "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
          "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
          "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
          "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
          "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", 
          "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
          "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
          "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
          "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
        ];
        
        setCountries(countriesList);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ 
          ...form, 
          idImage: file,
          imagePreview: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Save to backend here if needed
  };

  const generatePDF = () => {
    try {
      // Import jsPDF dynamically if needed
      import('jspdf').then((jsPDFModule) => {
        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(230, 88, 0); // Orange color for title
        doc.text('Travel Lead Details', 105, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Reset to black
        
        // Add image to PDF if available
        if (form.imagePreview) {
          try {
            // Add header for the image section
            doc.setFontSize(12);
            doc.setTextColor(66, 66, 66);
            doc.text('Client ID Document:', 10, 25);
            
            // Add the image 
            doc.addImage(form.imagePreview, 'JPEG', 10, 30, 60, 45);
            
            // Add a border around the image
            doc.setDrawColor(200, 200, 200);
            doc.rect(10, 30, 60, 45);
          } catch (imageError) {
            console.error('Error adding image to PDF:', imageError);
            // Add a note if image couldn't be added
            doc.text('* ID Image could not be added to PDF', 10, 30);
          }
        }
        
        // Starting position for text - below image if present
        let yPosition = form.imagePreview ? 85 : 30;
        
        // Add section header
        doc.setFontSize(14);
        doc.setTextColor(230, 88, 0); // Orange
        doc.text('Client Information', 10, yPosition);
        yPosition += 8;
        
        // Reset text style for data
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Add form data
        const lineHeight = 8;
        doc.text(`Full Name: ${form.fullName}`, 10, yPosition); yPosition += lineHeight;
        doc.text(`Nationality: ${form.nationality}`, 10, yPosition); yPosition += lineHeight;
        doc.text(`Phone: ${form.phone}`, 10, yPosition); yPosition += lineHeight;
        
        yPosition += 4; // Add some spacing
        
        // Add travel details section
        doc.setFontSize(14);
        doc.setTextColor(230, 88, 0); // Orange
        doc.text('Travel Details', 10, yPosition);
        yPosition += 8;
        
        // Reset text style for data
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        doc.text(`Destination: ${form.destination}`, 10, yPosition); yPosition += lineHeight;
        doc.text(`Package Type: ${form.packageType}`, 10, yPosition); yPosition += lineHeight;
        doc.text(`Number of People: ${form.numPeople}`, 10, yPosition); yPosition += lineHeight;
        doc.text(`Transport: ${form.transport}`, 10, yPosition); yPosition += lineHeight;
        
        // Add footer with date
        const today = new Date();
        const dateStr = today.toLocaleDateString();
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Generated on: ${dateStr}`, 10, 280);
        
        // Add company info at bottom (replace with your company name)
        doc.setFontSize(10);
        doc.text('Your Travel Company Name', 105, 285, { align: 'center' });
        
        // Save the PDF
        const fileName = form.fullName ? 
          `Lead_${form.fullName.replace(/\s+/g, '_')}.pdf` : 
          `Travel_Lead_${new Date().getTime()}.pdf`;
          
        doc.save(fileName);
        
        // Close form after PDF is downloaded
        setTimeout(() => {
          setFormClosed(true);
          // Reset form for next entry
          setForm({
            fullName: '',
            nationality: '',
            phone: '',
            destination: '',
            packageType: '',
            numPeople: 1,
            transport: '',
            idImage: null,
            imagePreview: null,
          });
          setSubmitted(false);
        }, 1000); // Small delay to ensure PDF download started
        
      }).catch(error => {
        console.error('Error loading jsPDF:', error);
        alert('Error generating PDF. Please ensure jsPDF is installed correctly.');
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please check console for details.');
    }
  };

  // Package options with descriptions
  const packages = [
    { value: "Basic", label: "Basic - Standard services" },
    { value: "Premium", label: "Premium - Enhanced comfort" },
    { value: "Luxury", label: "Luxury - VIP experience" },
    { value: "Family", label: "Family - Group discounts" },
    { value: "Pilgrimage", label: "Pilgrimage - Spiritual focus" }
  ];

  return (
    <>
    {!formClosed ? (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          New Lead Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Two-column layout for smaller screens and up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter client's full name"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  required
                  value={form.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  placeholder="+1 (123) 456-7890"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                  Destination <Map className="inline h-4 w-4" />
                </label>
                <select
                  id="destination"
                  name="destination"
                  required
                  value={form.destination}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Destination</option>
                  <option value="Pashupatinath">Pashupatinath</option>
                  <option value="Muktinath">Muktinath</option>
                  <option value="Both">Pashupatinath + Muktinath</option>
                </select>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">
                  Package Type
                </label>
                <select
                  id="packageType"
                  name="packageType"
                  required
                  value={form.packageType}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="numPeople" className="block text-sm font-medium text-gray-700">
                  Number of People <Users className="inline h-4 w-4" />
                </label>
                <input
                  id="numPeople"
                  name="numPeople"
                  type="number"
                  min="1"
                  required
                  value={form.numPeople}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="transport" className="block text-sm font-medium text-gray-700">
                  Transport <Wind className="inline h-4 w-4" />
                </label>
                <select
                  id="transport"
                  name="transport"
                  required
                  value={form.transport}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Transport</option>
                  <option value="Helicopter">Helicopter</option>
                  <option value="Car">Car</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="idImage" className="block text-sm font-medium text-gray-700">
                  ID Document <Camera className="inline h-4 w-4" />
                </label>
                <input
                  id="idImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
          
          {/* Image preview */}
          {form.imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">ID Document Preview:</p>
              <div className="relative h-40 w-full md:w-1/2 mx-auto border rounded-md overflow-hidden">
                <img 
                  src={form.imagePreview} 
                  alt="ID Preview" 
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-center mt-6">
            {!submitted ? (
              <button 
                type="submit" 
                className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md transition duration-300 ease-in-out flex items-center"
              >
                Submit Lead
              </button>
            ) : (
              <button
                type="button"
                onClick={generatePDF}
                className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md transition duration-300 ease-in-out flex items-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </button>
            )}
          </div>
        </form>
        
        {/* Status indicator */}
        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-center">
              Lead successfully submitted! You can now download the PDF.
            </p>
          </div>
        )}
      </div>
    ) : (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold text-green-600 mb-4">Lead Submitted Successfully!</h3>
        <p className="text-gray-700 mb-6">The client information has been saved and the PDF has been downloaded.</p>
        <button 
          onClick={() => {
            setFormClosed(false);
          }} 
          className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md transition duration-300 ease-in-out"
        >
          Add Another Lead
        </button>
      </div>
    )}
    </>
  );
}