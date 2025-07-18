import React from "react";
import { FaTachometerAlt, FaCogs, FaGasPump } from "react-icons/fa";

const VehicleGrid = ({ filteredVehicles, handleViewDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVehicles.map((vehicle) => (
        <div
          key={vehicle.vehicle_id}
          className={`relative bg-white rounded-lg border overflow-hidden hover:shadow-lg transition duration-300 ${
            vehicle.inventory_status === "IN" ? "border-green-500" : "border-red-500"
          }`}
        >
          <button
            onClick={() => handleViewDetails(vehicle)}
            className="absolute inset-0 w-full h-full cursor-pointer z-10"
          />
          {/* Status Badge */}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-sm font-semibold rounded-md ${
              vehicle.inventory_status === "IN"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {vehicle.inventory_status}
          </span>
          <img
            src={
              vehicle.vehicle_image_urls && vehicle.vehicle_image_urls.length > 0
                ? vehicle.vehicle_image_urls[0]
                : "https://via.placeholder.com/300x200?text=Vehicle"
            }
            alt={vehicle.vehicle_model}
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Vehicle"; }}
          />
          <div className="p-4">
            <p className="text-sm text-gray-500">{vehicle.license_plate_number}</p>
            <h2 className="text-lg font-semibold mt-1">{vehicle.vehicle_model}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Price: ₹{vehicle.purchase_price?.toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
              <span className="flex items-center">
                <FaTachometerAlt className="mr-1" /> {vehicle.odometer_reading_kms} kms
              </span>
              <span className="flex items-center">
                <FaCogs className="mr-1" /> {vehicle.transmission_type}
              </span>
              <span className="flex items-center">
                <FaGasPump className="mr-1" /> {vehicle.fuel_type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;