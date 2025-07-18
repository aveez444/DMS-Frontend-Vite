import React from "react";

const VehicleTable = ({ filteredVehicles, handleViewDetails, formatDate }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-4 border">Type</th>
            <th className="p-4 border">Make</th>
            <th className="p-4 border">Model</th>
            <th className="p-4 border">Year</th>
            <th className="p-4 border">Chassis</th>
            <th className="p-4 border">Plate</th>
            <th className="p-4 border">Odometer</th>
            <th className="p-4 border">Color</th>
            <th className="p-4 border">Fuel</th>
            <th className="p-4 border">Transmission</th>
            <th className="p-4 border">Seller</th>
            <th className="p-4 border">Mobile</th>
            <th className="p-4 border">Email</th>
            <th className="p-4 border">Condition</th>
            <th className="p-4 border">Tires</th>
            <th className="p-4 border">Damage</th>
            <th className="p-4 border">Engine</th>
            <th className="p-4 border">Interior</th>
            <th className="p-4 border">Arrival</th>
            <th className="p-4 border">Price</th>
            <th className="p-4 border">Storage</th>
            <th className="p-4 border">Notes</th>
            <th className="p-4 border">Status</th>
            <th className="p-4 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((vehicle) => (
            <tr key={vehicle.vehicle_id} className="hover:bg-gray-100">
              <td className="p-4 border">{vehicle.vehicle_type}</td>
              <td className="p-4 border">{vehicle.vehicle_make}</td>
              <td className="p-4 border">{vehicle.vehicle_model}</td>
              <td className="p-4 border">{vehicle.year_of_manufacturing}</td>
              <td className="p-4 border">{vehicle.chassis_number}</td>
              <td className="p-4 border">{vehicle.license_plate_number}</td>
              <td className="p-4 border">{vehicle.odometer_reading_kms} km</td>
              <td className="p-4 border">{vehicle.color}</td>
              <td className="p-4 border">{vehicle.fuel_type}</td>
              <td className="p-4 border">{vehicle.transmission_type}</td>
              <td className="p-4 border">{vehicle.seller_name_company_name}</td>
              <td className="p-4 border">{vehicle.mobile_number}</td>
              <td className="p-4 border">{vehicle.email_address}</td>
              <td className="p-4 border">{vehicle.condition_grade}</td>
              <td className="p-4 border">{vehicle.tires_condition}</td>
              <td className="p-4 border">{vehicle.damage_details_if_any}</td>
              <td className="p-4 border">{vehicle.engine_condition}</td>
              <td className="p-4 border">
                {typeof vehicle.interior_condition === "boolean"
                  ? vehicle.interior_condition
                    ? "Yes"
                    : "No"
                  : vehicle.interior_condition}
              </td>
              <td className="p-4 border">
                {vehicle.arrival_date ? formatDate(vehicle.arrival_date) : "N/A"}
              </td>
              <td className="p-4 border">₹{vehicle.purchase_price}</td>
              <td className="p-4 border">{vehicle.storage_location}</td>
              <td className="p-4 border">{vehicle.notes || "N/A"}</td>
              <td className="p-4 border">
                {vehicle.inventory_status === "IN" ? (
                  <span className="text-green-600 font-bold">IN</span>
                ) : (
                  <span className="text-red-600 font-bold">OUT</span>
                )}
              </td>
              <td className="p-4 border">
                <button
                  onClick={() => handleViewDetails(vehicle)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
