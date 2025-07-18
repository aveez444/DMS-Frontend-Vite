import React, { useState, useEffect, useRef, useContext } from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi"; 
import { FaFilter } from "react-icons/fa"; 
import SelectVehicleOutbound from "./SelectVehicleOutbound";
import OutboundStepOne from "./OutboundStepOne";
import OutboundStepTwo from "./OutboundStepTwo";
import OutboundTable from "./OutboundTable";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Outbound = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Sidebar & responsive state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Data fetching states
  const [outboundRecords, setOutboundRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 0: "Select Vehicle" modal
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  // Step 1 (OutboundStepOne)
  const [showStepOne, setShowStepOne] = useState(false);

  // Step 2 (OutboundStepTwo)
  const [showStepTwo, setShowStepTwo] = useState(false);

  // Selected vehicle and form data
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    outboundType: "",
    dateRange: { start: "", end: "" },
    costRange: { min: "", max: "" },
  });
  const filterDropdownRef = useRef(null);

  // Fetch outbound vehicles data
  const fetchOutboundVehicles = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/dealership/outbound-vehicles/", {
        withCredentials: true,
      });
      const data = response.data.data; // Assuming the data is in response.data.data
      setOutboundRecords(data);
    } catch (error) {
      console.error("Error fetching outbound vehicles:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
      setError("Failed to load outbound vehicles. Please try again.");
      setOutboundRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch data on mount
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user) {
      fetchOutboundVehicles();
    }
  }, [user, isLoading, navigate]);

  // Responsive resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // (Optional) Filter dropdown logic
  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen((prev) => !prev);
  };

  // Step 0: "Select Vehicle" open
  const handleAddOutboundClick = () => {
    setIsSelectModalOpen(true);
  };
  const handleCloseSelectModal = () => {
    setIsSelectModalOpen(false);
  };
  const handleVehicleSelected = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsSelectModalOpen(false);
    // Now show Step One
    setShowStepOne(true);
  };

  // Step 1: OutboundStepOne
  const handleCloseStepOne = () => {
    setShowStepOne(false);
  };
  const handleNextStep = (data) => {
    // data = the partial form data from Step One
    setInitialData(data);
    setShowStepOne(false);
    setShowStepTwo(true);
  };

  // Step 2: OutboundStepTwo
  const handleCloseStepTwoModal = () => {
    setShowStepTwo(false);
  };
  const handleNewOutboundRecord = (record) => {
    // This is called once Step Two successfully posts
    setOutboundRecords((prevRecords) => [...prevRecords, record]);
    setShowStepTwo(false);
  };
  const applyFilters = () => {
    return outboundRecords.filter((record) => {
      const matchesOutboundType =
        !filters.outboundType || record.outbound === filters.outboundType;

      const matchesDateRange =
        (!filters.dateRange.start || new Date(record.outbound_date) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end || new Date(record.outbound_date) <= new Date(filters.dateRange.end));

      const matchesCostRange =
        (!filters.costRange.min || record.selling_price >= parseFloat(filters.costRange.min)) &&
        (!filters.costRange.max || record.selling_price <= parseFloat(filters.costRange.max));

      return matchesOutboundType && matchesDateRange && matchesCostRange;
    });
  };

  const filteredRecords = applyFilters();

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
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

      {/* Sidebar */}
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

        <div className="p-6">
          {/* Header row */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
            <h1 className="text-[24px] md:text-[32px] text-gray-700 md:leading-tight mb-4 md:mb-0">
              Outbound Vehicles
            </h1>
              
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
              
              <button
                onClick={handleAddOutboundClick}
                className="px-4 py-2 w-auto md:w-[214px] h-[40px] md:h-[48px] text-sm md:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                + Add Outbound
              </button>
              <button
                className="px-4 py-2 md:w-[214px] md:h-[48px] text-sm md:text-base border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-100 transition duration-300"
              >
                Export to Excel
              </button>
            </div>
          </div>

          {/* Outbound Table */}
          <div className="mt-6 overflow-x-auto">
            <OutboundTable outboundData={filteredRecords} />
          </div>
        </div>
      </div>

      {/* Step 0: Select Vehicle */}
      {isSelectModalOpen && (
        <SelectVehicleOutbound
          closeModal={handleCloseSelectModal}
          onSelectVehicle={handleVehicleSelected}
        />
      )}

      {/* Step 1 */}
      {showStepOne && selectedVehicle && (
        <OutboundStepOne
          closeModal={handleCloseStepOne}
          vehicle={selectedVehicle}
          onNext={handleNextStep}
          initialData={initialData}
        />
      )}

      {/* Step 2 */}
      {showStepTwo && initialData && (
        <OutboundStepTwo
          closeModal={handleCloseStepTwoModal}
          initialData={initialData}
          onSubmitOutbound={handleNewOutboundRecord}
        />
      )}
    </div>
  );
};

export default Outbound;
