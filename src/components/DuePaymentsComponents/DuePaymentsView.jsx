import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HiArrowLeft, HiCurrencyRupee, HiCalendar, HiExclamation, HiCheckCircle, HiMenu } from "react-icons/hi";
import PaymentDetailsCollapse from "./PaymentDetailsCollapse";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../DashboardComponents/Sidebar";

const DuePaymentsView = () => {
    const { id: vehicle_id } = useParams();
    const [vehicleData, setVehicleData] = useState(null);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [costDetails, setCostDetails] = useState(null);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Sidebar state management
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // Fetch vehicle details, payment summary, and cost details
    useEffect(() => {
        const fetchData = async () => {
            if (!user || !vehicle_id) {
                console.log("Missing user or vehicle_id");
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
        
                console.log(`Fetching data for vehicle: ${vehicle_id}`);
                
                const [vehicleRes, paymentRes, costRes] = await Promise.all([
                    axiosInstance.get(`/dealership/vehicle-detail/${vehicle_id}/`),
                    axiosInstance.get(`/dealership/vehicle-payment-summary/${vehicle_id}/`),
                    axiosInstance.get(`/dealership/vehicle-cost/${vehicle_id}/`)
                ]);
        
                setVehicleData(vehicleRes.data);
                setPaymentSummary(paymentRes.data);
                setCostDetails(costRes.data);
        
                // Fetch vehicle images separately
                try {
                    const imageResponse = await axiosInstance.get(`/dealership/vehicles/${vehicle_id}/images/`);
                    const imageUrls = imageResponse.data.map((img) => img.image_url);
                    setVehicleImages(imageUrls);
                } catch (imgError) {
                    console.error(`Error fetching images for vehicle ${vehicle_id}:`, imgError);
                    setVehicleImages([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                } else if (error.response?.status === 404) {
                    setError("Vehicle not found");
                } else {
                    setError("Failed to load data. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vehicle_id, user, navigate]);

    // Calculate profit and profit percentage
    const calculateProfit = () => {
        if (!paymentSummary || !costDetails) return { profit: 0, percentage: 0 };
        
        const profit = paymentSummary.selling_price - costDetails.total_cost;
        const percentage = (profit / costDetails.total_cost) * 100;
        
        return {
            profit,
            percentage: percentage.toFixed(2)
        };
    };

    // Format currency with commas for Indian format
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    // Custom status indicator
    const PaymentStatusIndicator = ({ title, balance, isPurchase = false }) => {
        let statusColor = "gray";
        let statusMessage = "No data";
        let icon = null;

        if (balance !== undefined) {
            if (balance === 0) {
                statusColor = "green";
                statusMessage = "Completed";
                icon = <HiCheckCircle className="w-5 h-5" />;
            } else if (balance > 0) {
                if (isPurchase) {
                    statusColor = "red";
                    statusMessage = "Payment Due";
                    icon = <HiExclamation className="w-5 h-5" />;
                } else {
                    statusColor = "blue";
                    statusMessage = "Pending Receipt";
                    icon = <HiCalendar className="w-5 h-5" />;
                }
            }
        }

        return (
            <div className={`flex items-center gap-2 text-${statusColor}-600 font-medium`}>
                {icon}
                <span>{statusMessage}</span>
            </div>
        );
    };

    // Sidebar toggle function
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
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
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading vehicle payment details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
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
                        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiExclamation className="text-red-500 w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                            <p className="text-red-500 mb-6">{error}</p>
                            <button 
                                onClick={() => navigate("/dashboard/due-payments")}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Back to Due Payments
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!vehicleData || !paymentSummary || !costDetails) {
        return (
            <div className="flex h-screen bg-gray-100">
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
                        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiExclamation className="text-yellow-500 w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
                            <p className="text-gray-500 mb-6">Vehicle data is not available</p>
                            <button 
                                onClick={() => navigate("/dashboard/due-payments")}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Back to Due Payments
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { profit, percentage } = calculateProfit();
    const isProfitable = profit > 0;
    
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar Toggle Button */}
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
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
                className={`flex-1 transition-all duration-300 overflow-y-auto ${
                    isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Back button and page title */}
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <Link 
                                    to="/dashboard/due-payments" 
                                    className="flex items-center text-gray-600 hover:text-blue-500 transition duration-200"
                                >
                                    <HiArrowLeft className="mr-2" /> Back to Due Payments
                                </Link>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Payment Details
                            </h1>
                        </div>

                        {/* Main content */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Hero section with vehicle image and basic info */}
                            <div className="relative">
                                <div className="h-48 sm:h-64 md:h-80 bg-gray-200 overflow-hidden">
                                <img
                                    src={
                                        vehicleImages && vehicleImages.length > 0
                                            ? vehicleImages[0]
                                            : "/assets/placeholder.jpg"
                                    }
                                    alt={`${vehicleData.vehicle_make} ${vehicleData.vehicle_model}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/placeholder.jpg";
                                    }}
                                />
                                </div>
                                
                                {/* Vehicle name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                                    <h2 className="text-white text-2xl sm:text-3xl font-bold">
                                        {vehicleData.vehicle_make} {vehicleData.vehicle_model}
                                    </h2>
                                    <p className="text-gray-200 text-lg">
                                        {vehicleData.year_of_manufacturing} • {vehicleData.fuel_type} • {vehicleData.transmission_type}
                                    </p>
                                </div>
                            </div>

                            {/* Payment status highlight section */}
                            <div className="bg-blue-50 p-4 sm:p-6 border-b border-blue-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Purchase Payment Status */}
                                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Purchase Due</h3>
                                                <PaymentStatusIndicator 
                                                    balance={paymentSummary.purchase_balance} 
                                                    isPurchase={true} 
                                                />
                                            </div>
                                            <div className="flex items-center text-red-500">
                                                <HiCurrencyRupee className="w-5 h-5" />
                                                <span className="text-xl font-bold">
                                                    {formatCurrency(paymentSummary.purchase_balance)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Sale Payment Status */}
                                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Sale Receivable</h3>
                                                <PaymentStatusIndicator 
                                                    balance={paymentSummary.selling_balance} 
                                                    isPurchase={false} 
                                                />
                                            </div>
                                            <div className="flex items-center text-blue-500">
                                                <HiCurrencyRupee className="w-5 h-5" />
                                                <span className="text-xl font-bold">
                                                    {formatCurrency(paymentSummary.selling_balance)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Profit Status */}
                                    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${isProfitable ? 'border-green-500' : 'border-red-500'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Profit/Loss</h3>
                                                <div className={`flex items-center gap-1 ${isProfitable ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                                    <span>{isProfitable ? 'Profit' : 'Loss'} {percentage}%</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                                                <HiCurrencyRupee className="w-5 h-5" />
                                                <span className="text-xl font-bold">
                                                    {formatCurrency(Math.abs(profit))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {/* Vehicle Details Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                                        Vehicle Information
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">License Plate</p>
                                                <p className="text-lg font-medium">{vehicleData.license_plate_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Year</p>
                                                <p className="text-lg font-medium">{vehicleData.year_of_manufacturing}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Fuel Type</p>
                                                <p className="text-lg font-medium">{vehicleData.fuel_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Transmission</p>
                                                <p className="text-lg font-medium">{vehicleData.transmission_type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Details Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                                        Cost Breakdown
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Purchase Price</h3>
                                            <div className="flex items-center mt-auto">
                                                <HiCurrencyRupee className="text-gray-600 w-5 h-5" />
                                                <span className="text-xl font-bold text-gray-800">
                                                    {formatCurrency(costDetails.purchase_price)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Maintenance Cost</h3>
                                            <div className="flex items-center mt-auto">
                                                <HiCurrencyRupee className="text-gray-600 w-5 h-5" />
                                                <span className="text-xl font-bold text-gray-800">
                                                    {formatCurrency(costDetails.total_maintenance_cost)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cost</h3>
                                            <div className="flex items-center mt-auto">
                                                <HiCurrencyRupee className="text-gray-600 w-5 h-5" />
                                                <span className="text-xl font-bold text-gray-800">
                                                    {formatCurrency(costDetails.total_cost)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                                        Payment Summary
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Purchase Summary */}
                                        <div className="bg-gray-50 rounded-lg p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20">
                                                <div className="absolute transform rotate-45 bg-red-500 text-white text-xs py-1 right-[-35px] top-[20px] w-[140px] text-center">
                                                    {paymentSummary.purchase_balance === 0 ? 'COMPLETED' : 'PENDING'}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Purchase Details</h3>
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Purchase Price:</span>
                                                    <div className="flex items-center">
                                                        <HiCurrencyRupee className="text-gray-600 w-4 h-4" />
                                                        <span className="font-semibold">{formatCurrency(paymentSummary.purchase_price)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Total Paid:</span>
                                                    <div className="flex items-center text-green-600">
                                                        <HiCurrencyRupee className="w-4 h-4" />
                                                        <span className="font-semibold">{formatCurrency(paymentSummary.total_purchase_paid)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Balance Due:</span>
                                                    <div className="flex items-center text-red-600">
                                                        <HiCurrencyRupee className="w-4 h-4" />
                                                        <span className="font-bold text-lg">{formatCurrency(paymentSummary.purchase_balance)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                                <div className="flex items-start">
                                                    <HiExclamation className="text-red-500 w-5 h-5 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-red-800">Payment Required</h4>
                                                        <p className="text-sm text-red-700 mt-1">
                                                            {paymentSummary.purchase_balance === 0 
                                                                ? "All payments completed. No outstanding balance." 
                                                                : `Outstanding balance of ₹${formatCurrency(paymentSummary.purchase_balance)} needs to be paid.`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Selling Summary */}
                                        <div className="bg-gray-50 rounded-lg p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20">
                                                <div className="absolute transform rotate-45 bg-blue-500 text-white text-xs py-1 right-[-35px] top-[20px] w-[140px] text-center">
                                                    {paymentSummary.selling_balance === 0 ? 'COMPLETED' : 'PENDING'}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Selling Details</h3>
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Selling Price:</span>
                                                    <div className="flex items-center">
                                                        <HiCurrencyRupee className="text-gray-600 w-4 h-4" />
                                                        <span className="font-semibold">{formatCurrency(paymentSummary.selling_price)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Total Received:</span>
                                                    <div className="flex items-center text-green-600">
                                                        <HiCurrencyRupee className="w-4 h-4" />
                                                        <span className="font-semibold">{formatCurrency(paymentSummary.total_selling_received)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Balance Receivable:</span>
                                                    <div className="flex items-center text-blue-600">
                                                        <HiCurrencyRupee className="w-4 h-4" />
                                                        <span className="font-bold text-lg">{formatCurrency(paymentSummary.selling_balance)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                                <div className="flex items-start">
                                                    <HiCalendar className="text-blue-500 w-5 h-5 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-blue-800">Payment Status</h4>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            {paymentSummary.selling_balance === 0 
                                                                ? "All payments received. No pending balance." 
                                                                : `Outstanding balance of ₹${formatCurrency(paymentSummary.selling_balance)} is yet to be received.`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Slots Section */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                                        Payment Schedule
                                    </h2>
                                    <PaymentDetailsCollapse vehicle_id={vehicle_id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuePaymentsView;