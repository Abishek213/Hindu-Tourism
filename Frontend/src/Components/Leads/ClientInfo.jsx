// src/components/LeadForm/ClientInfoForm.jsx
import { useState, useEffect } from 'react';
import { Users, Mail, Phone } from 'lucide-react';

export default function ClientInfoForm({ form, handleChange }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="space-y-4 lg:col-span-1">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        Client Information
      </h3>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name*
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder="Enter client's full name"
          required
          value={form.fullName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address <Mail className="inline h-4 w-4 text-gray-500" />
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="client@example.com"
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
          Nationality*
        </label>
        <select
          id="nationality"
          name="nationality"
          required
          value={form.nationality}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          Phone Number* <Phone className="inline h-4 w-4 text-gray-500" />
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="+1 (123) 456-7890"
          required
          value={form.phone}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
