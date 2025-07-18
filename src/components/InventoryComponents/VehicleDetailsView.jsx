import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../DashboardComponents/Sidebar";
import EditVehicleModal from "./EditVehicleModal";
import { HiMenu } from "react-icons/hi"; 

const VehicleDetailsView = () => {
    const [vehicle, setVehicle] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    const { id } = useParams();
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!user || !id) return;
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching vehicle details for ID:", id);
                const response = await axiosInstance.get(`/dealership/vehicle-detail/${id}/`);
                const foundVehicle = response.data;
                console.log("Vehicle details response:", foundVehicle);
    
                if (!foundVehicle) {
                    throw new Error("Vehicle not found");
                }
    
                // Fetch images separately
                const imageResponse = await axiosInstance.get(`/dealership/vehicles/${id}/images/`);
                const imageUrls = imageResponse.data.map((img) => img.image_url);
                setImages(imageUrls.length > 0 ? imageUrls : ["/assets/placeholder.jpg"]);
                setVehicle(foundVehicle);
            } catch (err) {
                console.error("Error fetching vehicle details:", err.response?.data || err.message);
                if (err.response?.status === 401) {
                    console.log("Session expired, redirecting to login");
                    localStorage.removeItem("session_id");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchVehicleDetails();
    }, [id, user, navigate, refreshTrigger]);


    const handleEditModalClose = () => {
        setShowEditModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleSetVehicle = (updatedVehicle) => {
        setVehicle(prev => ({...prev, ...updatedVehicle}));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderDetailItem = (label, value, colSpan = 1) => (
        <div className={`${colSpan === 2 ? 'col-span-2' : ''}`}>
            <p className="text-gray-500 text-sm mb-1">{label}</p>
            <p className="font-medium">{value || "N/A"}</p>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderDetailItem("Odometer Reading", vehicle.odometer_reading_kms ? `${vehicle.odometer_reading_kms} kms` : "N/A")}
                            {renderDetailItem("Fuel Type", vehicle.fuel_type)}
                            {renderDetailItem("Transmission", vehicle.transmission_type)}
                            {renderDetailItem("Color", vehicle.color)}
                            {renderDetailItem("Condition", vehicle.condition_grade)}
                            {renderDetailItem("Year of Manufacturing", vehicle.year_of_manufacturing)}
                        </div>
                    </div>
                );
            case "details":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {renderDetailItem("Vehicle Type", vehicle.vehicle_type)}
                                {renderDetailItem("Make", vehicle.vehicle_make)}
                                {renderDetailItem("Model", vehicle.vehicle_model)}
                                {renderDetailItem("Year", vehicle.year_of_manufacturing)}
                                {renderDetailItem("Chassis Number", vehicle.chassis_number)}
                                {renderDetailItem("License Plate", vehicle.license_plate_number)}
                                {renderDetailItem("OSN Number", vehicle.osn_number)}
                                {renderDetailItem("Engine Number", vehicle.engine_number)}
                                {renderDetailItem("Year of Registration", vehicle.year_of_registration)}
                            </div>
                        </div>
                    </div>
                );
            case "condition":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Condition Assessment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {renderDetailItem("Overall Condition", vehicle.condition_grade)}
                                {renderDetailItem("Inspection Date", formatDate(vehicle.inspection_date))}
                                {renderDetailItem("Tires Condition", vehicle.tires_condition)}
                                {renderDetailItem("Engine Condition", vehicle.engine_condition)}
                                {renderDetailItem("Interior Condition", vehicle.interior_condition)}
                                {renderDetailItem("Damage Details", vehicle.damage_details_if_any, 2)}
                            </div>
                        </div>
                    </div>
                );
            case "purchase":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Purchase Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {renderDetailItem("Purchase Price", vehicle.purchase_price ? `₹${vehicle.purchase_price.toLocaleString()}` : "N/A")}
                                {renderDetailItem("Purchase Date", formatDate(vehicle.date_of_purchase))}
                                {renderDetailItem("Inventory Status", vehicle.inventory_status)}
                                {renderDetailItem("Storage Location", vehicle.storage_location)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {vehicle.purchase_agreement_url && (
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Purchase Agreement</p>
                                        <a 
                                            href={vehicle.purchase_agreement_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                        >
                                            View Document
                                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                                            </svg>
                                        </a>
                                    </div>
                                )}
                                {vehicle.proof_of_ownership_url && (
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Proof of Ownership</p>
                                        <a 
                                            href={vehicle.proof_of_ownership_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                        >
                                            View Document
                                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "seller":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {renderDetailItem("Name/Company", vehicle.seller_name_company_name)}
                                {renderDetailItem("Contact Number", vehicle.mobile_number)}
                                {renderDetailItem("Email Address", vehicle.email_address)}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab to view details</div>;
        }
    };

    if (authLoading || loading && !vehicle) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-red-500 p-8 rounded-xl shadow-lg bg-white max-w-md">
                    <h3 className="text-xl font-semibold mb-3">Error Loading Data</h3>
                    <p className="mb-6 text-gray-700">{error}</p>
                    <button 
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-xl text-gray-600">No vehicle details available</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <HiMenu size={24} />
                </button>
            )}

            {/* Sidebar Component */}
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                toggleSidebar={toggleSidebar} 
                isMobile={isMobile} 
            />
            
            {/* Main Content Area */}
            <div 
                className={`flex-1 overflow-y-auto transition-all duration-300 ${
                    isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                {/* Loading overlay when refreshing data */}
                {loading && vehicle && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-center text-gray-700">Refreshing vehicle data...</p>
                        </div>
                    </div>
                )}

                {showEditModal && (
                <EditVehicleModal
                    vehicleId={vehicle.vehicle_id}
                    onClose={handleEditModalClose}
                    setVehicle={handleSetVehicle}
                />
                )}

                <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
                    >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Inventory
                    </button>
                    
                    <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit Details
                    </button>
                    
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Vehicle
                    </button>
                    </div>
                </div>
            

                    {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                        <p className="mb-6 text-gray-700">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                            Cancel
                            </button>
                            <button
                            onClick={async () => {
                                setShowDeleteModal(false);
                                try {
                                setLoading(true);
                                await axiosInstance.delete(`/dealership/delete-vehicle/${id}/`);
                                alert("Vehicle deleted successfully");
                                navigate("/dashboard/inventory");
                                } catch (error) {
                                console.error("Error deleting vehicle:", error);
                                alert(`Failed to delete vehicle: ${error.response?.data?.message || error.message}`);
                                } finally {
                                setLoading(false);
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                            Delete
                            </button>
                        </div>
                        </div>
                    </div>
                    )}

                    {/* Vehicle Title Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {vehicle.year_of_manufacturing || "N/A"} {vehicle.vehicle_make || "Unknown"}{" "}
                                    {vehicle.vehicle_model || "Model"}
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    <span className="font-medium">License Plate No:</span> {vehicle.license_plate_number || "N/A"}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                                <p className="text-gray-500 text-sm">Purchased for:</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{vehicle.purchase_price?.toLocaleString() || "N/A"}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    on {formatDate(vehicle.date_of_purchase)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="relative aspect-w-16 aspect-h-9 bg-gray-100">
                                    <img
                                        src={images[selectedImage] || "/assets/placeholder.jpg"}
                                        alt={`Image of ${vehicle.vehicle_model}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/assets/placeholder.jpg";
                                        }}
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                                aria-label="Next image"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                                        {images.map((img, idx) => (
                                            <button
                                                key={`${img}-${idx}`}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${
                                                    selectedImage === idx 
                                                        ? "ring-2 ring-blue-500 scale-105" 
                                                        : "opacity-70 hover:opacity-100"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/assets/placeholder.jpg";
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold">Status</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        vehicle.inventory_status === 'IN' 
                                            ? 'bg-green-100 text-green-800' 
                                            : vehicle.inventory_status === 'OUT' 
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {vehicle.inventory_status || "Unknown"}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Purchased on</p>
                                        <p className="font-medium">{formatDate(vehicle.date_of_purchase)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Storage Location</p>
                                        <p className="font-medium">{vehicle.storage_location || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section - 3 columns on lg screens */}
                        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Tabs */}
                            <div className="flex overflow-x-auto border-b">
                                {["overview", "details", "condition", "purchase", "seller"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                                            activeTab === tab
                                                ? "border-b-2 border-blue-600 text-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default VehicleDetailsView;