import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi";
import { FaGasPump, FaCogs, FaTachometerAlt } from "react-icons/fa";

const CataloguePage = () => {
  // UI State
  const [vehicles, setVehicles] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { uuid } = useParams(); // Get UUID from URL params

  // Auth State
  const { user, isLoading: authLoading } = useContext(AuthContext);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSidebarExpanded(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data with error handling
  useEffect(() => {
    if (!user) return;
  
    const fetchCatalogue = async () => {
      try {
        const response = await axiosInstance.get("/dealership/catalogue/");
        const enriched = await Promise.all(response.data.map(async (v) => {
          try {
            const imgRes = await axiosInstance.get(`/dealership/vehicles/${v.vehicle_id}/images/`);
            const imageUrls = imgRes.data.map((img) => img.image_url);
            return { ...v, vehicle_image_urls: imageUrls };
          } catch {
            return { ...v, vehicle_image_urls: [] };
          }
        }));
        setVehicles(enriched);
      } catch (err) {
        console.error("Error fetching catalogue:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("session_id");
          navigate("/login");
        }
      }
    };
  
    fetchCatalogue();
  }, [user, navigate]);
  

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Vehicle handlers
  const handleVehicleClick = (vehicleId) => navigate(`/dashboard/${uuid}/catalogue/${vehicleId}`);
  const handleEditClick = (vehicleId) => navigate(`/dashboard/${uuid}/catalogue/edit/${vehicleId}`);
  const handleShareClick = (vehicleId) => alert(`Share ${vehicleId}`);
  const toggleDropdown = (vehicleId) => setDropdownVisible(dropdownVisible === vehicleId ? null : vehicleId);
  const handleImageError = (e) => {
    e.target.src = "/assets/placeholder.jpg";
    e.target.onerror = null;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
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
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
      }`}>
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Vehicle Catalogue</h1>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.vehicle_id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border border-gray-200 relative"
              >
                {/* Top-right icons */}
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick(vehicle.vehicle_id);
                    }}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-1.5 rounded-full shadow-sm hover:text-blue-600 transition-colors"
                  >
                    <FiShare2 size={16} />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(vehicle.vehicle_id);
                      }}
                      className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-1.5 rounded-full shadow-sm hover:text-blue-600 transition-colors"
                    >
                      <BsThreeDots size={16} />
                    </button>

                    {dropdownVisible === vehicle.vehicle_id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 w-32">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(vehicle.vehicle_id);
                            setDropdownVisible(null);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-gray-700"
                        >
                          Update Vehicle
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Image */}
                <div 
                  className="relative pt-[56%] w-full cursor-pointer"
                  onClick={() => handleVehicleClick(vehicle.vehicle_id)}
                >
                  <img src={(vehicle.vehicle_image_urls?.[0]) || "/assets/placeholder.jpg"}
                    alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>

                {/* Vehicle Details */}
                <div className="p-3 flex-grow">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleVehicleClick(vehicle.vehicle_id)}
                  >
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h2 className="text-sm font-bold text-gray-800">
                        {vehicle.vehicle_make} {vehicle.vehicle_model}
                      </h2>
                      <div className="flex items-center text-gray-500 text-xs">
                        <span>{vehicle.year_of_manufacturing}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <FaGasPump className="mr-1 text-blue-500" size={12} /> Fuel
                        </span>
                        <span className="text-gray-800">{vehicle.fuel_type}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <FaCogs className="mr-1 text-blue-500" size={12} /> Trans
                        </span>
                        <span className="text-gray-800">{vehicle.transmission_type}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <FaTachometerAlt className="mr-1 text-blue-500" size={12} /> Odometer
                        </span>
                        <span className="text-gray-800">{vehicle.odometer_reading_kms} km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-bold text-blue-600">
                      {formatCurrency(vehicle.selling_price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CataloguePage;