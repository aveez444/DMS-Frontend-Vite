import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OutboundStepTwo = ({ closeModal, initialData, onSubmitOutbound, onBackToStepOne }) => {
  const [costDetails, setCostDetails] = useState({
    purchase_price: 0,
    total_maintenance_cost: 0,
    total_cost: 0,
  });
  const [profitMargin, setProfitMargin] = useState(0);
  const [profitAmount, setProfitAmount] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [formData, setFormData] = useState({
    notes: "",
    delivery_status: "Pending",
    other_expense: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchVehicleCost = async () => {
      if (!user || !initialData?.vehicle_id) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/dealership/vehicle-cost/${initialData.vehicle_id}/`
        );
        setCostDetails(response.data);
      } catch (error) {
        console.error("Error fetching vehicle cost:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        setError("Failed to load vehicle cost details");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVehicleCost();
    }
  }, [user, initialData?.vehicle_id, navigate]);

  useEffect(() => {
    setSellingPrice(
      profitAmount
        ? costDetails.total_cost + parseFloat(profitAmount)
        : costDetails.total_cost * (1 + profitMargin / 100)
    );
  }, [profitMargin, profitAmount, costDetails.total_cost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !initialData?.vehicle_id) return;
    
    const finalData = {
      ...initialData,
      ...formData,
      selling_price: sellingPrice,
      vehicle_id: initialData.vehicle_id,
    };

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post(
        `/dealership/outbound-vehicle/${initialData.vehicle_id}/`,
        finalData
      );
      onSubmitOutbound(response.data);
      closeModal();
    } catch (error) {
      console.error("Error submitting outbound data:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      setError(error.response?.data?.message || "Failed to submit outbound data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] md:w-[550px] relative">
        {/* Modal Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">Add Profit Margin</h2>

        {/* Purchase & Maintenance Cost Section */}
        <div className="border p-4 rounded-md bg-gray-50 mb-4">
          <p className="text-gray-700 font-semibold">Purchase Price: <span className="text-blue-500">₹{costDetails.purchase_price}</span></p>
          <p className="text-gray-700 font-semibold">Maintenance Cost: <span className="text-blue-500">₹{costDetails.total_maintenance_cost}</span></p>
          <p className="text-gray-800 font-bold">Total Cost: <span className="text-green-600">₹{costDetails.total_cost}</span></p>
        </div>

        {/* Profit Calculation Section */}
        <div className="border p-4 rounded-md bg-gray-50 mb-4">
          <h3 className="text-lg font-semibold mb-2">Profit Calculation</h3>

          {/* Profit Margin Slider */}
          <label className="block text-sm font-medium text-gray-700">Profit Margin (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            className="w-full mt-1 mb-2"
          />
          <p className="text-gray-600 text-sm">Selected: {profitMargin}%</p>

          {/* Manual Profit Entry */}
          <label className="block text-sm font-medium text-gray-700 mt-2">Enter Fixed Profit Amount:</label>
          <input
            type="number"
            placeholder="Enter profit amount"
            value={profitAmount}
            onChange={(e) => setProfitAmount(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />

          {/* Selling Price */}
          <p className="mt-4 text-lg font-semibold">Selling Price: <span className="text-green-600">₹{sellingPrice}</span></p>
        </div>

        {/* Additional Details */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>

          <label className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          ></textarea>

          <label className="block text-sm font-medium text-gray-700 mt-2">Delivery Status:</label>
          <select
            name="delivery_status"
            value={formData.delivery_status}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Other Expense:</label>
          <input
            type="number"
            name="other_expense"
            value={formData.other_expense}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={() => onBackToStepOne()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutboundStepTwo;
