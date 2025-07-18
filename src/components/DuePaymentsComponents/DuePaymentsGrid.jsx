
import React from "react";
import { FaTachometerAlt, FaCogs, FaGasPump, FaCalendarAlt } from "react-icons/fa";

const DuePaymentsGrid = ({ filteredVehicles, handleViewDetails }) => {
  // Format currency with commas for Indian format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVehicles.length === 0 ? (
        <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-500">No vehicles found matching your criteria</p>
        </div>
      ) : (
        filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.vehicle_id}
            className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
          >
            <button
              onClick={() => handleViewDetails(vehicle)}
              className="absolute inset-0 w-full h-full cursor-pointer z-10"
              aria-label={`View details for ${vehicle.vehicle_model}`}
            />
            <div className="relative">
              <img
                src={
                  vehicle.vehicle_image_urls && vehicle.vehicle_image_urls.length > 0
                    ? vehicle.vehicle_image_urls[0]
                    : "/assets/placeholder-vehicle.jpg"
                }
                alt={vehicle.vehicle_model}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/fallback-vehicle.jpg";
                }}
              />
              <div className="absolute top-0 right-0 m-3 bg-white bg-opacity-90 px-2 py-1 rounded-md text-xs font-semibold text-blue-700">
                {vehicle.license_plate_number}
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 truncate">{vehicle.vehicle_model}</h2>
              <div className="flex items-center mt-2 text-sm">
                <FaCalendarAlt className="text-gray-500 mr-1" />
                <span className="text-gray-600">
                  {vehicle.manufacturing_year || "N/A"}
                </span>
              </div>
              <p className="mt-3 font-medium text-gray-700">
                Purchase Price: <span className="text-blue-600">{formatCurrency(vehicle.purchase_price || 0)}</span>
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center p-1 rounded-lg bg-gray-50">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaTachometerAlt className="mr-1 text-blue-500" />
                    </div>
                    <span className="font-medium">{vehicle.odometer_reading_kms || "0"} km</span>
                  </div>
                  <div className="flex flex-col items-center p-1 rounded-lg bg-gray-50">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCogs className="mr-1 text-blue-500" />
                    </div>
                    <span className="font-medium">{vehicle.transmission_type || "N/A"}</span>
                  </div>
                  <div className="flex flex-col items-center p-1 rounded-lg bg-gray-50">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaGasPump className="mr-1 text-blue-500" />
                    </div>
                    <span className="font-medium">{vehicle.fuel_type || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline relative z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(vehicle);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
            {vehicle.payment_due && (
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DuePaymentsGrid;
