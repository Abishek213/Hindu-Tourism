import { useState } from "react";

export default function AssignTeamForm() {
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showTransportForm, setShowTransportForm] = useState(false);

  const [guides, setGuides] = useState([]);
  const [transports, setTransports] = useState([]);

  const [newGuide, setNewGuide] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
  });

  const [newTransport, setNewTransport] = useState({
    vehicleName: "",
    vehicleType: "",
    vehicleCategory: "luxury",
  });

  const handleGuideChange = (e) => {
    const { name, value } = e.target;
    setNewGuide((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setNewTransport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGuide = () => {
    setGuides((prev) => [...prev, { ...newGuide, id: Date.now().toString() }]);
    setNewGuide({ name: "", age: "", email: "", phone: "", experience: "", specialization: "" });
    setShowGuideForm(false);
  };

  const handleAddTransport = () => {
    setTransports((prev) => [...prev, { ...newTransport, id: Date.now().toString() }]);
    setNewTransport({ vehicleName: "", vehicleType: "", vehicleCategory: "luxury" });
    setShowTransportForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={() => setShowGuideForm(!showGuideForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          {showGuideForm ? "Cancel" : "Create Guide"}
        </button>
        <button
          onClick={() => setShowTransportForm(!showTransportForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          {showTransportForm ? "Cancel" : "Create Transport"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guide Form */}
        {showGuideForm && (
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-orange-600">Create Guide</h3>
            <div className="space-y-3">
              {['name', 'age', 'email', 'phone', 'experience', 'specialization'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={newGuide[field]}
                  onChange={handleGuideChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-3 border border-orange-200 rounded-lg"
                />
              ))}
              <button
                onClick={handleAddGuide}
                className="w-full mt-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              >
                Add Guide
              </button>
            </div>
          </div>
        )}

        {/* Transport Form */}
        {showTransportForm && (
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-amber-600">Create Transport</h3>
            <div className="space-y-3">
              <input
                name="vehicleName"
                value={newTransport.vehicleName}
                onChange={handleTransportChange}
                placeholder="Vehicle Name"
                className="w-full p-3 border border-amber-200 rounded-lg"
              />
              <input
                name="vehicleType"
                value={newTransport.vehicleType}
                onChange={handleTransportChange}
                placeholder="Vehicle Type"
                className="w-full p-3 border border-amber-200 rounded-lg"
              />
              <select
                name="vehicleCategory"
                value={newTransport.vehicleCategory}
                onChange={handleTransportChange}
                className="w-full p-3 border border-amber-200 rounded-lg"
              >
                <option value="luxury">Luxury</option>
                <option value="premium">Premium</option>
                <option value="delux">Delux</option>
              </select>
              <button
                onClick={handleAddTransport}
                className="w-full mt-2 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
              >
                Add Transport
              </button>
            </div>
          </div>
        )}

        {/* Guide List */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-md font-semibold mb-3 text-orange-700">Guide List</h3>
          <ul className="space-y-2">
            {guides.map((guide) => (
              <li key={guide.id} className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                <div className="font-bold">{guide.name}</div>
                <div className="text-sm text-gray-600">Age: {guide.age}, Email: {guide.email}, Phone: {guide.phone}</div>
                <div className="text-sm text-gray-600">Experience: {guide.experience}, Specialization: {guide.specialization}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Transport List */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-md font-semibold mb-3 text-amber-700">Transport List</h3>
          <ul className="space-y-2">
            {transports.map((transport) => (
              <li key={transport.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="font-bold">{transport.vehicleName}</div>
                <div className="text-sm text-gray-600">Type: {transport.vehicleType}, Category: {transport.vehicleCategory}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
