import React, { useEffect, useState, useContext } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    const fetchInventoryData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching inventory for user:", user.username);
            const response = await axiosInstance.get(`/dealership/inventory/`, {
                withCredentials: true,
            });
            const data = response.data;
            console.log("Inventory response:", data);
            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => (a.odometer_reading_kms || 0) - (b.odometer_reading_kms || 0));
                setInventoryData(sortedData.slice(0, 5));
            } else {
                setInventoryData([]);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("Session expired or unauthorized, redirecting to login");
                localStorage.clear();
                navigate("/login");
            }
            setError("Failed to load inventory. Please try again.");
            setInventoryData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchInventoryData();
        }
    }, [user, navigate]);

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    // Function to determine condition color
    const getConditionColor = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'excellent':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'good':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'fair':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'poor':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Inventory</h2>
                <button
                    onClick={fetchInventoryData}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                    disabled={loading || !user}
                >
                    <FiRefreshCw className="mr-2 text-lg" />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 font-medium">Maker</th>
                            <th className="p-2 font-medium">Model</th>
                            <th className="p-2 font-medium">License Plate</th>
                            <th className="p-2 font-medium">Odometer</th>
                            <th className="p-2 font-medium">Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="p-2">{item.vehicle_make || "N/A"}</td>
                                <td className="p-2">{item.vehicle_model || "N/A"}</td>
                                <td className="p-2">{item.license_plate_number || "N/A"}</td>
                                <td className="p-2">{item.odometer_reading_kms || "N/A"}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getConditionColor(item.condition_grade)}`}
                                        style={{
                                            fontFamily: "'Roboto', sans-serif",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {item.condition_grade || "Unknown"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {inventoryData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;