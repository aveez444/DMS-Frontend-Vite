import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiMenu, HiOutlineSearch, HiX } from "react-icons/hi";
import { FaGasPump, FaCogs, FaTachometerAlt, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../DashboardComponents/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

const ListVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const { uuid } = useParams();

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768;
            setIsMobile(newIsMobile);
            if (!newIsMobile) {
                setIsSidebarExpanded(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch vehicles
    useEffect(() => {
        const fetchVehicles = async () => {
            if (!user) return;
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching all vehicles");
                const response = await axiosInstance.get("/dealership/all-inventory/");
                console.log("Vehicles response:", response.data);
                
                if (Array.isArray(response.data)) {
                    // Fetch images for each vehicle
                    const vehiclesWithImages = await Promise.all(
                        response.data.map(async (vehicle) => {
                            try {
                                const imageResponse = await axiosInstance.get(
                                    `/dealership/vehicles/${vehicle.vehicle_id}/images/`
                                );
                                const imageUrls = imageResponse.data.map((img) => img.image_url);
                                return { ...vehicle, vehicle_image_urls: imageUrls };
                            } catch (imgError) {
                                console.error(`Error fetching images for vehicle ${vehicle.vehicle_id}:`, imgError);
                                return { ...vehicle, vehicle_image_urls: [] };
                            }
                        })
                    );
                    setVehicles(vehiclesWithImages);
                } else {
                    setVehicles([]);
                }
            } catch (error) {
                // Keep the existing error handling
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [user, navigate]);

    // Sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    // Format currency using Intl
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Filter vehicles based on search term
    const filteredVehicles = vehicles.filter(vehicle => {
        const searchString = `${vehicle.vehicle_make || ''} ${vehicle.vehicle_model || ''} ${vehicle.year_of_manufacturing || ''}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    // Loading state with improved UI
    if (loading || authLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                />
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-0"
                    }`}
                >
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading your vehicles...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state with improved UI
    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                />
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                    }`}
                >
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Data Loading Error</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-[1000] bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-md focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <HiMenu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 p-4 md:p-6 ${
                    isMobile ? "ml-0" : isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                {/* Header Section with Title and Search */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Updates Manager</h1>
                    
                    {/* Search Box */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <HiOutlineSearch size={18} />
                        </div>
                        {searchTerm && (
                            <button 
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchTerm('')}
                            >
                                <HiX size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* No Results Message */}
                {filteredVehicles.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className="text-lg font-medium text-gray-800 mb-2">No vehicles found</h2>
                        <p className="text-gray-600 max-w-md mx-auto">No vehicles match your search criteria.</p>
                        
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {/* Responsive Grid with Improved Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredVehicles.map((vehicle) => (
                        <div
                            key={vehicle.vehicle_id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border border-gray-200"
                        >
                            {/* Vehicle Image with proper aspect ratio */}
                            <div className="relative pt-[56%]"> {/* 16:9 aspect ratio */}
                            <img
                                        src={
                                            vehicle.vehicle_image_urls && vehicle.vehicle_image_urls.length > 0
                                                ? vehicle.vehicle_image_urls[0]
                                                : "/assets/placeholder.jpg"
                                        }
                                        alt={`${vehicle.vehicle_make || ''} ${vehicle.vehicle_model || ''}`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/assets/placeholder.jpg";
                                        }}
                                    />
                                
                                {/* License Plate Badge */}
                                {vehicle.license_plate_number && (
                                    <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-0.5 rounded text-xs font-medium text-gray-800">
                                        {vehicle.license_plate_number}
                                    </div>
                                )}
                            </div>

                            {/* Vehicle Details */}
                            <div className="p-3 flex-grow flex flex-col">
                                <div className="mb-2 pb-2 border-b border-gray-100">
                                    <h2 className="text-sm font-bold text-gray-800">
                                        {vehicle.vehicle_make || ''} {vehicle.vehicle_model || ''}
                                    </h2>
                                    
                                    <div className="flex items-center text-gray-500 text-xs">
                                        <FaCalendarAlt className="mr-1 text-gray-400" size={12} />
                                        <span>{vehicle.year_of_manufacturing || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs mb-3">
                                    {vehicle.fuel_type && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 flex items-center">
                                                <FaGasPump className="mr-1 text-blue-500" size={12} /> Fuel
                                            </span>
                                            <span className="text-gray-800">{vehicle.fuel_type}</span>
                                        </div>
                                    )}
                                    
                                    {vehicle.transmission_type && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 flex items-center">
                                                <FaCogs className="mr-1 text-blue-500" size={12} /> Trans
                                            </span>
                                            <span className="text-gray-800">{vehicle.transmission_type}</span>
                                        </div>
                                    )}
                                    
                                    {vehicle.odometer_reading_kms !== undefined && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 flex items-center">
                                                <FaTachometerAlt className="mr-1 text-blue-500" size={12} /> Odometer
                                            </span>
                                            <span className="text-gray-800">{vehicle.odometer_reading_kms || 0} km</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Price Information */}
                                {vehicle.purchase_price && (
                                    <div className="text-xs mb-2 font-medium text-gray-700 flex justify-between">
                                        <span>Purchase Price:</span>
                                        <span className="text-blue-600">{formatCurrency(vehicle.purchase_price)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Update Button */}
                            <div className="px-3 pb-3">
                                <Link
                                    to={`/dashboard/${uuid}/updates-management/${vehicle.vehicle_id}/`}
                                    className="w-full bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block text-center"
                                >
                                    Update
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Results Summary */}
                {filteredVehicles.length > 0 && (
                    <div className="mt-4 text-center text-gray-500 text-xs">
                        Showing {filteredVehicles.length} of {vehicles.length} vehicles
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListVehicles;