import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Gauge, Droplet, Car, Clock } from "lucide-react";
import { HiMenu } from "react-icons/hi";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../DashboardComponents/Sidebar";

const DetailedCataloguePage = () => {
  // UI State
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < (vehicle.vehicle_image_urls?.length - 1) ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (vehicle.vehicle_image_urls?.length - 1)
    );
  };
  const navigate = useNavigate();

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
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarExpanded(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch vehicle details with auth
  useEffect(() => {
    if (!user) return;

    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const [vehicleRes, imageRes] = await Promise.all([
          axiosInstance.get(`/dealership/catalogue/${id}/`),
          axiosInstance.get(`/dealership/vehicles/${id}/images/`)
        ]);
    
        const imageUrls = imageRes.data.map((img) => img.image_url);
        setVehicle({ ...vehicleRes.data, vehicle_image_urls: imageUrls });
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("session_id");
          navigate("/login");
        }
        setError(err.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id, user, navigate]);

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading auth...</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-500 text-2xl mb-4">Oops! Something went wrong</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">No vehicle details available</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
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
        <div className="min-h-screen bg-gray-50 pb-12 overflow-y-auto">
          {/* Navigation Header */}
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="w-full px-4 py-4 flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                Vehicle Details
              </h1>
            </div>
          </div>

          {/* Vehicle Content */}
          <div className="w-full px-4 mt-6">
            {/* Vehicle Image */}
            <div className="relative w-full mb-6 rounded-xl overflow-hidden shadow-lg h-[200px] md:h-[350px]">
                    <img
                      src={
                        vehicle.vehicle_image_urls?.[currentImageIndex] ||
                        "/assets/placeholder.jpg"
                      }
                      alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/assets/placeholder.jpg")}
                    />
                    {vehicle.vehicle_image_urls?.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/60 text-white px-2 py-1 rounded-full"
                        >
                          ◀
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/60 text-white px-2 py-1 rounded-full"
                        >
                          ▶
                        </button>
                      </>
                    )}
                  </div>


            {/* Vehicle Details Container */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* Title and Price */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {vehicle.year_of_manufacturing} {vehicle.vehicle_make} {vehicle.vehicle_model}
                </h2>
                <p className="text-2xl font-semibold text-blue-600 mt-2">
                  {vehicle.selling_price !== "Price on Request"
                    ? `₹${vehicle.selling_price}`
                    : "Price on Request"}
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem 
                  icon={<Gauge size={24} className="text-blue-500" />} 
                  label="Odometer" 
                  value={`${vehicle.odometer_reading_kms} kms`} 
                />
                <DetailItem 
                  icon={<Droplet size={24} className="text-green-500" />} 
                  label="Fuel Type" 
                  value={vehicle.fuel_type} 
                />
                <DetailItem 
                  icon={<Car size={24} className="text-purple-500" />} 
                  label="Transmission" 
                  value={vehicle.transmission_type} 
                />
                <DetailItem 
                  icon={<Clock size={24} className="text-orange-500" />} 
                  label="Condition" 
                  value={vehicle.condition_grade} 
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Vehicle Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {vehicle.description || `Experience the thrill of driving the ${vehicle.year_of_manufacturing}
                  ${vehicle.vehicle_make} ${vehicle.vehicle_model}. With its powerful
                  ${vehicle.fuel_type} engine and ${vehicle.transmission_type} transmission,
                  this vehicle delivers an exceptional driving experience.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2">
                  <MapPin size={20} />
                  <span>Contact Seller</span>
                </button>
                <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 flex items-center justify-center space-x-2">
                  <Car size={20} />
                  <span>Schedule Test Drive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DetailedCataloguePage;