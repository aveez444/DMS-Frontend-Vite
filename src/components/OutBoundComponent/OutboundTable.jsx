import React from "react";
import { FiRefreshCw } from "react-icons/fi";

const OutboundTable = ({ outboundData }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Make</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Model</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">License Plate</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Buyer Name</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Delivery Status</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Outbound Date</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Selling Price</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Notes</th>
        </tr>
      </thead>
      <tbody>
        {outboundData.length > 0 ? (
          outboundData.map((record, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">
                {record.vehicle_make || "N/A"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {record.vehicle_model || "N/A"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {record.license_plate_number || "N/A"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {record.buyers_name || "N/A"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  record.delivery_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  record.delivery_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {record.delivery_status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {formatDate(record.outbound_date)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {formatPrice(record.selling_price)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {record.notes || "N/A"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="px-4 py-2 text-center text-sm text-gray-500">
              No outbound vehicle records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OutboundTable;