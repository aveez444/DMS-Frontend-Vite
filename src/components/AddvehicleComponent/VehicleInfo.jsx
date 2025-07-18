import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import dashboardImages from "../../assets/dashboardimages/dashboardImages";
import { useFormData } from "./FormDataContext";

const VehicleInfo = ({ onNext, onBack, onClose }) => {
  const { formData, updateFormData } = useFormData();

  const [vehicleData, setVehicleData] = useState({
    vehicle_type: formData.vehicleInfo?.vehicle_type || "car", // Default matches backend
    vehicle_make: formData.vehicleInfo?.vehicle_make || "",
    vehicle_model: formData.vehicleInfo?.vehicle_model || "",
    year_of_manufacturing: formData.vehicleInfo?.year_of_manufacturing || "",
    year_of_registration: formData.vehicleInfo?.year_of_registration || null, // Nullable in backend
    chassis_number: formData.vehicleInfo?.chassis_number || "", // VIN, max_length = 5
    engine_number: formData.vehicleInfo?.engine_number || null, // Nullable
    osn_number: formData.vehicleInfo?.osn_number || null, // Nullable
    license_plate_number: formData.vehicleInfo?.license_plate_number || "",
    odometer_reading_kms: formData.vehicleInfo?.odometer_reading_kms || 0, // PositiveIntegerField
    color: formData.vehicleInfo?.color || "",
    fuel_type: formData.vehicleInfo?.fuel_type || "",
    transmission_type: formData.vehicleInfo?.transmission_type || "",
  });

  const vehicleTypes = [
    { id: "car", label: "Car", image: dashboardImages.carlogo },
    { id: "bus", label: "Bus", image: dashboardImages.bus },
    { id: "truck", label: "Truck", image: dashboardImages.truck },
    { id: "three_wheelers", label: "Three Wheelers", image: dashboardImages.loaders },
  ];

  const handleInputChange = (e) => {
    setVehicleData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVehicleTypeSelect = (typeId) => {
    setVehicleData((prev) => ({
      ...prev,
      vehicle_type: typeId || "car", // Defaults to 'car' if not selected
    }));
  };

  const handleNext = () => {
    updateFormData("vehicleInfo", vehicleData);
    onNext();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-5xl 
                      max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl z-10"
        >
          <IoClose />
        </button>

        {/* Sidebar (Steps Navigation) */}
        <aside className="hidden md:flex md:w-[25%] bg-gray-50 border-r p-4 flex-col">
          <h2 className="text-lg font-semibold mb-3">Add Vehicle</h2>
          <ul className="text-sm">
            {["Vehicle Info", "Seller Info", "Inspection"].map((step, index) => (
              <li
                key={index}
                className={`py-2 px-3 mb-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-200 transition ${
                  index === 0 ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-center md:text-left mb-4">Vehicle Information</h2>

            {/* Vehicle Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {vehicleTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer text-sm transition ${
                    vehicleData.vehicle_type === type.id
                      ? "border-blue-500 bg-blue-100"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleVehicleTypeSelect(type.id)}
                >
                  <img src={type.image} alt={type.label} className="w-16 h-12 mb-2 object-contain" />
                  <span>{type.label}</span>
                </div>
              ))}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              {[
                { label: "Vehicle Make", name: "vehicle_make" },
                { label: "Vehicle Model", name: "vehicle_model" },
                { label: "Year Mfg.", name: "year_of_manufacturing", type: "number" },
                { label: "Year Reg.", name: "year_of_registration", type: "number", optional: true },
                { label: "Chassis No.", name: "chassis_number", maxLength: 5 },
                { label: "Engine No.", name: "engine_number", optional: true },
                { label: "OSN No.", name: "osn_number", optional: true },
                { label: "License Plate", name: "license_plate_number" },
                { label: "Odometer (KM)", name: "odometer_reading_kms", type: "number" },
                { label: "Color", name: "color" },
              ].map(({ label, name, type, maxLength, optional }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {label}{optional ? " (Optional)" : ""}
                  </label>
                  <input
                    type={type || "text"}
                    name={name}
                    value={vehicleData[name] || ""}
                    onChange={handleInputChange}
                    maxLength={maxLength}
                    className="border rounded p-2 h-10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder={`Enter ${label}`}
                  />
                </div>
              ))}

              {/* Dropdowns */}
              {[
                { label: "Fuel Type", name: "fuel_type", options: ["Petrol", "Diesel", "Electric"] },
                { label: "Transmission", name: "transmission_type", options: ["Manual", "Automatic"] },
              ].map(({ label, name, options }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">{label}</label>
                  <select
                    name={name}
                    value={vehicleData[name]}
                    onChange={handleInputChange}
                    className="border rounded p-2 h-10 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Buttons Container */}
          <div className="p-4 border-t bg-white sticky bottom-0">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;