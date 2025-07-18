import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "../DashboardComponents/Sidebar";

const EditCatalogue = () => {
  // UI State
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Auth State
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [firstImage, setFirstImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

  // Vehicle Data State
  const [vehicle, setVehicle] = useState(null);
  const [costDetails, setCostDetails] = useState({
    purchase_price: 0,
    total_maintenance_cost: 0,
    total_cost: 0,
  });
  
  // Pricing State
  const [profitMargin, setProfitMargin] = useState(0);
  const [profitAmount, setProfitAmount] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    odometer_reading_kms: "",
    condition_grade: "",
  });

  // Calculate selling price
  const sellingPrice = useMemo(() => {
    const base = parseFloat(costDetails.total_cost) || 0;
    if (profitAmount) return (base + parseFloat(profitAmount)).toFixed(2);
    return (base * (1 + profitMargin / 100)).toFixed(2);
  }, [profitMargin, profitAmount, costDetails.total_cost]);

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

  // Fetch vehicle data with auth
  useEffect(() => {
    if (!user) return;

    const fetchVehicleData = async () => {
      try {
        const [vehicleRes, costRes, imageRes] = await Promise.all([
          axiosInstance.get(`/dealership/catalogue/${id}/`),
          axiosInstance.get(`/dealership/vehicle-cost/${id}/`),
          axiosInstance.get(`/dealership/vehicles/${id}/images/`)
        ]);
        
        setFirstImage(imageRes.data[0]?.image_url || null);
        setVehicle(vehicleRes.data);
        setCostDetails(costRes.data);
        
        setFormData({
          odometer_reading_kms: vehicleRes.data.odometer_reading_kms,
          condition_grade: vehicleRes.data.condition_grade,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("session_id");
          navigate("/login");
        }
        setError("Failed to load vehicle data");
      }
    };

    fetchVehicleData();
  }, [id, user, navigate]);

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
        const catalogueData = {};

        // Validate and add odometer_reading_kms
        const odometerValue = formData.odometer_reading_kms
            ? parseInt(formData.odometer_reading_kms, 10)
            : null;
        if (odometerValue !== null && !isNaN(odometerValue)) {
            catalogueData.odometer_reading_kms = odometerValue;
        }

        // Validate and add condition_grade
        const validGrades = ["Excellent", "Good", "Fair", "Poor"];
        if (formData.condition_grade && validGrades.includes(formData.condition_grade)) {
            catalogueData.condition_grade = formData.condition_grade;
        }

        // Validate and add estimated_selling_price
        if (sellingPrice && !isNaN(parseFloat(sellingPrice))) {
            catalogueData.estimated_selling_price = parseFloat(sellingPrice).toFixed(2);
        }

        // Check if there are any changes to submit
        if (Object.keys(catalogueData).length === 0) {
            setError("No valid changes to save.");
            setIsSubmitting(false);
            return;
        }

        await axiosInstance.patch(
            `/dealership/catalogue/update/${id}/`,
            catalogueData,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        setSuccessMessage("Changes saved successfully!");
    } catch (err) {
        console.error("Error updating vehicle:", err);
        const errorMessage = err.response?.data
            ? Object.entries(err.response.data)
                  .map(([key, errors]) => `${key}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                  .join('; ')
            : "Failed to save changes. Please try again.";
        setError(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
};

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading auth...</div>;
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-400"></div>
          <p className="mt-3 text-base font-medium text-gray-700">Loading vehicle data...</p>
        </div>
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
        <div className="bg-gray-50 min-h-screen pb-12 overflow-y-auto">
          {/* Header */}
          <div className="bg-white shadow-sm py-3 px-6">
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Catalogue
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Edit Vehicle Catalogue</h1>
              <div className="w-24"></div> {/* Spacer for flex alignment */}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* Main Form Content */}
          <div className="w-full p-6">
            <form onSubmit={handleSubmit}>
              {/* Main Grid Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Vehicle Image and Details */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  {/* Vehicle Image */}
                  <div className="relative h-64">
                    <img
                      src={firstImage || "/assets/placeholder.jpg"}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/assets/placeholder.jpg")}
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-4 flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Odometer Reading (kms)
                        </label>
                        <input
                          type="number"
                          name="odometer_reading_kms"
                          value={formData.odometer_reading_kms}
                          onChange={handleInputChange}
                          className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition Grade
                        </label>
                        <select
                          name="condition_grade"
                          value={formData.condition_grade}
                          onChange={handleInputChange}
                          className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Cost Summary */}
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col">
                  <div className="bg-white rounded-lg shadow-md p-6 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Cost Summary</h2>
                    <div className="space-y-6 flex-grow">
                      <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                          <p className="text-2xl font-bold text-gray-900">₹{costDetails.purchase_price}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 flex items-start">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Maintenance Cost</p>
                          <p className="text-2xl font-bold text-gray-900">₹{costDetails.total_maintenance_cost}</p>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 flex items-start">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                          <p className="text-2xl font-bold text-gray-900">₹{costDetails.total_cost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profit Calculation */}
                <div className="col-span-12 md:col-span-4 lg:col-span-5 flex flex-col">
                  <div className="bg-white rounded-lg shadow-md p-6 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Profit Calculation</h2>
                    <div className="space-y-6 flex-grow">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-base font-medium text-gray-700">
                            Margin (%)
                          </label>
                          <span className="text-base text-blue-600 font-bold">{profitMargin}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={profitMargin}
                          onChange={(e) => {
                            setProfitMargin(e.target.value);
                            setProfitAmount("");
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                          Fixed Profit Amount
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">₹</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={profitAmount}
                            onChange={(e) => {
                              setProfitAmount(e.target.value);
                              setProfitMargin(0);
                            }}
                            className="pl-8 w-full p-3 text-base bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg mt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-700">Final Selling Price</p>
                          </div>
                          <p className="text-3xl font-bold text-green-600">₹{sellingPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Action Button */}
              <div className="bg-white shadow-lg mt-6 p-4 rounded-lg flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center ${
                    isSubmitting ? 'opacity-70' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCatalogue;