import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const OutboundStepOne = ({ closeModal, vehicle, onNext, initialData }) => {
  const [stepOneData, setStepOneData] = useState(() => ({
    vehicle_id: vehicle.vehicle_id, // For API submission
    vehicle_model: vehicle.vehicle_model || "Vehicle",
    buyers_name: initialData?.buyers_name || "",
    buyers_contact_details: initialData?.buyers_contact_details || "",
    buyers_address: initialData?.buyers_address || "",
    outbound_date: initialData?.outbound_date || "",
    estimated_delivery_date: initialData?.estimated_delivery_date || "",
    vehicle_current_condition: initialData?.vehicle_current_condition || "Yes",
  }));
  const [vehicleImage, setVehicleImage] = useState("https://via.placeholder.com/150");

  // Fetch vehicle image
  useEffect(() => {
    const fetchVehicleImage = async () => {
      if (!vehicle.vehicle_id) return;
      try {
        const response = await axiosInstance.get(`/dealership/vehicles/${vehicle.vehicle_id}/images/`);
        const imageUrls = response.data.map((img) => img.image_url);
        if (imageUrls.length > 0) {
          setVehicleImage(imageUrls[0]);
        }
      } catch (error) {
        console.error(`Error fetching image for vehicle ${vehicle.vehicle_id}:`, error);
        setVehicleImage("https://via.placeholder.com/150");
      }
    };

    fetchVehicleImage();
  }, [vehicle.vehicle_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStepOneData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext(stepOneData);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 rounded-lg shadow-md w-[400px] md:w-[500px] relative">
        <button
          onClick={closeModal}
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✗
        </button>

        <h2 className="text-lg font-semibold mb-2">Add Outbound - Buyer Information</h2>

        {/* Vehicle Info */}
        <div className="flex items-center mb-4">
          <img
            src={vehicleImage}
            alt={vehicle.vehicle_make}
            className="w-24 h-24 rounded-md object-cover mr-4"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
          />
          <div>
            <h3 className="text-lg font-semibold">{vehicle.vehicle_make || "Vehicle"}</h3>
            <p className="text-gray-600">
              {vehicle.license_plate_number ? `Plate: ${vehicle.license_plate_number}` : "No License Plate Available"}
            </p>
          </div>
        </div>

        <form onSubmit={handleNext}>
          {/* Vehicle Model */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vehicle Model:</label>
            <input
              type="text"
              name="vehicle_model"
              value={stepOneData.vehicle_model}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Buyer Details */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Buyer's Name:</label>
            <input
              type="text"
              name="buyers_name"
              value={stepOneData.buyers_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contact Details:</label>
            <input
              type="text"
              name="buyers_contact_details"
              value={stepOneData.buyers_contact_details}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Estimated Delivery + Outbound Date */}
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Outbound Date</label>
              <input
                type="date"
                name="outbound_date"
                value={stepOneData.outbound_date}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Estimated Delivery Date</label>
              <input
                type="date"
                name="estimated_delivery_date"
                value={stepOneData.estimated_delivery_date}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutboundStepOne;