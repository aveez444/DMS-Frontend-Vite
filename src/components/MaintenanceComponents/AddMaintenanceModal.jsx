import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const AddMaintenanceModal = ({ closeModal, vehicle, onSubmitMaintenance }) => {
    const [maintenanceType, setMaintenanceType] = useState("");
    const [cost, setCost] = useState("");
    const [personInCharge, setPersonInCharge] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const maintenanceOptions = [
        "Oil Change",
        "Brake Repair",
        "Tire Replacement",
        "Battery Replacement",
        "General Service",
        "Engine Tuning",
        "Coolant Refill",
    ];

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!maintenanceType || !cost || !personInCharge || !date) {
            setError("Please fill out all required fields.");
            return;
        }

        if (!vehicle?.vehicle_id) {
            setError("Missing vehicle information.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("maintenance_type", maintenanceType);
        formData.append("vehicle_id", vehicle.vehicle_id);
        formData.append("cost", cost);
        formData.append("person_in_charge", personInCharge);
        formData.append("maintenance_date", date);
        if (receipt) {
            formData.append("receipt", receipt);
        }

        try {
            const response = await axiosInstance.post(
                `/dealership/add-maintenance/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const newRecord = {
                maintenance_type: maintenanceType,
                vehicle_make: vehicle.vehicle_make || vehicle.name,
                license_plate_number: vehicle.license_plate_number || vehicle.plate,
                maintenance_date: date,
                cost: parseFloat(cost),
                person_in_charge: personInCharge,
                receipt: receipt ? receipt.name : "N/A",
            };
            onSubmitMaintenance(newRecord);

            alert("Maintenance record added successfully!");
            closeModal();
        } catch (error) {
            console.error("Error adding maintenance:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            setError(error.response?.data?.error || "Failed to add maintenance record.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={closeModal}
        >
            <div
                className="bg-white w-full max-w-lg mx-4 p-6 rounded-md shadow-md relative transform transition-transform duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Maintenance</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none text-lg"
                    >
                        ✖
                    </button>
                </div>

                <div className="flex items-center mb-4">
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-24 h-24 rounded-md object-cover mr-4"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                        <p className="text-gray-600">
                            {vehicle.plate ? vehicle.plate : "No License Plate Available"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Maintenance</label>
                        <select
                            value={maintenanceType}
                            onChange={(e) => setMaintenanceType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Select</option>
                            {maintenanceOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cost of Maintenance</label>
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                placeholder="₹XX,XXX"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Person in Charge</label>
                            <input
                                type="text"
                                value={personInCharge}
                                onChange={(e) => setPersonInCharge(e.target.value)}
                                placeholder="Enter Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Upload Receipt</label>
                        <input
                            type="file"
                            onChange={(e) => setReceipt(e.target.files[0])}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        />
                        {receipt && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Selected Receipt:</p>
                                <p className="text-sm text-blue-500">{receipt.name}</p>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaintenanceModal;