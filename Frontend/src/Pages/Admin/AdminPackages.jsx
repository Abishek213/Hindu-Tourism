import { useState } from 'react';
import { Plus, Trash2, Upload, Pencil } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    price: '',
    inclusions: '',
    exclusions: '',
    itinerary: '',
    accommodation: '',
    transport: '',
    meals: '',
    seasonalDiscount: '',
    brochure: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'brochure') {
      setNewPackage({ ...newPackage, brochure: files[0] });
    } else {
      setNewPackage({ ...newPackage, [name]: value });
    }
  };

  const handleAddPackage = () => {
    const id = Date.now();
    const addedPackage = { ...newPackage, id };
    setPackages([...packages, addedPackage]);

    // Reset form
    setNewPackage({
      title: '',
      description: '',
      price: '',
      inclusions: '',
      exclusions: '',
      itinerary: '',
      accommodation: '',
      transport: '',
      meals: '',
      seasonalDiscount: '',
      brochure: null,
    });
  };

  const handleDelete = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Packages</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="title"
          type="text"
          placeholder="Package Title"
          value={newPackage.title}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price ($)"
          value={newPackage.price}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPackage.description}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-full"
        />
        <textarea
          name="inclusions"
          placeholder="Inclusions (comma-separated)"
          value={newPackage.inclusions}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <textarea
          name="exclusions"
          placeholder="Exclusions (comma-separated)"
          value={newPackage.exclusions}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <textarea
          name="itinerary"
          placeholder="Days & Itinerary"
          value={newPackage.itinerary}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-full"
        />
        <input
          name="accommodation"
          type="text"
          placeholder="Accommodation details"
          value={newPackage.accommodation}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="transport"
          type="text"
          placeholder="Transport info"
          value={newPackage.transport}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="meals"
          type="text"
          placeholder="Meals included"
          value={newPackage.meals}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="seasonalDiscount"
          type="text"
          placeholder="Seasonal Discount (e.g., 10%)"
          value={newPackage.seasonalDiscount}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <div className="flex items-center gap-2">
          <input
            type="file"
            name="brochure"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <Upload size={18} className="text-gray-600" />
        </div>
        <button
          onClick={handleAddPackage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 col-span-full justify-center"
        >
          <Plus size={18} /> Add Package
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-10 mb-4">Existing Packages</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Accommodation</th>
              <th className="p-2 text-left">Transport</th>
              <th className="p-2 text-left">Meals</th>
              <th className="p-2 text-left">Discount</th>
              <th className="p-2 text-left">Brochure</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-t">
                <td className="p-2">{pkg.title}</td>
                <td className="p-2">${parseFloat(pkg.price).toFixed(2)}</td>
                <td className="p-2">{pkg.accommodation}</td>
                <td className="p-2">{pkg.transport}</td>
                <td className="p-2">{pkg.meals}</td>
                <td className="p-2">{pkg.seasonalDiscount}</td>
                <td className="p-2">
                  {pkg.brochure ? (
                    <span className="text-blue-600 underline cursor-pointer">
                      {pkg.brochure.name}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-2 flex gap-2">
                  <button className="text-green-600 hover:text-green-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No packages created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
