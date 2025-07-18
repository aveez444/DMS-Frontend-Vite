import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { FaTrash } from "react-icons/fa";

const MaintenanceTable = ({ records,  onDeleteRecord }) => {
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // Fetch maintenance data from API
    useEffect(() => {
        const fetchMaintenanceData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching maintenance data");
                const response = await axiosInstance.get(`/dealership/maintenance/`);
                console.log("Maintenance data response:", response.data);
                setMaintenanceData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching maintenance data:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    console.log("Session expired, redirecting to login");
                    localStorage.removeItem("session_id");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError("Failed to load maintenance records. Please try again.");
                setMaintenanceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMaintenanceData();
    }, [user, navigate]);

    // Open receipt modal
   
    // Open receipt modal
    const handleViewReceipt = (receiptUrl) => {
        if (receiptUrl) {
        setSelectedReceipt(receiptUrl);
        } else {
        alert("No receipt available for this record.");
        }
    };

    // Open details modal
    const handleViewDetails = (details) => {
        setSelectedDetails(details);
    };

    // Close modals
    const closeModal = () => {
        setSelectedReceipt(null);
        setSelectedDetails(null);
    };

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/dealership/maintenance/${recordToDelete.id}/`);
            // Call the parent component's onDeleteRecord function if it exists
            if (onDeleteRecord) {
                onDeleteRecord(recordToDelete.id);
            }
            // Also update local state
            setMaintenanceData(maintenanceData.filter(record => record.id !== recordToDelete.id));
            setRecordToDelete(null);
            alert("Maintenance record deleted successfully!");
        } catch (error) {
            console.error("Error deleting maintenance record:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
            }
            setError("Failed to delete maintenance record.");
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setRecordToDelete(null);
    };

    // Export to Excel
    const handleExportToExcel = async () => {
        try {
            console.log("Exporting maintenance records");
            const response = await axiosInstance.get(`/dealership/maintenance/export-excel/`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "maintenance_export.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting to Excel:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
            }
            alert("Failed to export maintenance records.");
        }
    };

    if (authLoading || loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }
    return (
        <div className="overflow-x-auto w-full max-w-full">
            <div className="flex justify-between items-center my-4 px-4">
                <h2 className="text-xl font-bold">Maintenance Records</h2>
            </div>

            <table className="table-auto w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-white">
                    <tr className="text-xs md:text-sm text-blue-600">
                        <th className="p-2 md:p-3">MAINTENANCE</th>
                        <th className="p-2 md:p-3">VEHICLE</th>
                        <th className="p-2 md:p-3">DATE</th>
                        <th className="p-2 md:p-3">COST</th>
                        <th className="p-2 md:p-3">RECEIPT</th>
                        <th className="p-2 md:p-3">DETAILS</th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceData.map((record, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                        >
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                                {record.maintenance_type}
                            </td>
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                                <div>
                                    <span className="block font-semibold">{record.vehicle_make}</span>
                                    <span className="block text-gray-500 text-xs">{record.license_plate_number}</span>
                                </div>
                            </td>
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                                {record.maintenance_date}
                            </td>
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                                ₹{record.cost}
                            </td>
                            <td className="p-2 md:p-3">
                            <button
                                onClick={() => handleViewReceipt(record.receipt_url)}
                                className={`px-2 py-1 text-xs md:text-sm font-medium rounded ${
                                    record.receipt_url
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                                disabled={!record.receipt_url}
                                >
                                {record.receipt_url ? "View Receipt" : "No Receipt"}
                            </button>
                            </td>
                            <td className="p-2 md:p-3">
                                <button
                                    onClick={() => handleViewDetails(record)}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs md:text-sm font-medium rounded hover:bg-blue-600 transition"
                                >
                                    View Details
                                </button>
                            </td>
                            <td className="p-2 md:p-3">
                                <button
                                    onClick={() => handleDeleteClick(record)}
                                    className="p-2 text-red-500 hover:text-red-700 transition"
                                    title="Delete Record"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedReceipt && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
                    onClick={closeModal}
                >
                    <div className="bg-white p-6 rounded-md shadow-md relative max-w-[90vw] w-full h-auto transform transition-transform duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Receipt</h2>
                        
                        {/* Improved receipt display */}
                        {selectedReceipt.toLowerCase().endsWith('.pdf') ? (
                            <iframe 
                                src={selectedReceipt} 
                                className="w-full h-[80vh] border rounded-md"
                                title="Receipt PDF"
                            />
                        ) : (
                            <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-100 rounded-md">
                                <img
                                    src={selectedReceipt}
                                    alt="Receipt"
                                    crossOrigin="anonymous"
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        const container = e.target.parentElement;
                                        if (container) {
                                            container.innerHTML = `
                                                <div class="text-center p-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p class="mt-2 text-gray-600">Receipt not available</p>
                                                    <p class="text-xs text-gray-500 mt-1">Could not load the receipt image</p>
                                                </div>
                                            `;
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedDetails && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 rounded-md shadow-md relative max-w-[90vw] w-full h-auto transform transition-transform duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Maintenance Details</h2>
                        <div className="text-gray-700 text-sm space-y-2">
                            <p><strong>Maintenance Type:</strong> {selectedDetails.maintenance_type}</p>
                            <p><strong>Vehicle:</strong> {selectedDetails.vehicle_make}</p>
                            <p><strong>Date:</strong> {selectedDetails.maintenance_date}</p>
                            <p><strong>Cost:</strong> ₹{selectedDetails.cost}</p>
                            <p><strong>Person Incharge:</strong> {selectedDetails.person_in_charge || "N/A"}</p>
                            <p><strong>Notes:</strong> {selectedDetails.notes || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

                        {/* Delete Confirmation Modal */}
            {recordToDelete && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
                    onClick={cancelDelete}
                >
                    <div
                        className="bg-white p-6 rounded-md shadow-md relative max-w-md w-full transform transition-transform duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={cancelDelete}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this maintenance record?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MaintenanceTable;