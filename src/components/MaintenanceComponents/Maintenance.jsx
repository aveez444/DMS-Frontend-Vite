import React, { useState, useEffect, useRef, useContext } from "react";
import { HiMenu } from "react-icons/hi";
import { FaFilter } from "react-icons/fa";
import Sidebar from "../DashboardComponents/Sidebar";
import SelectVehicleModal from "./SelectVehicleModal";
import AddMaintenanceModal from "./AddMaintenanceModal";
import MaintenanceTable from "./MaintenanceTable";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Maintenance = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isAddMaintenanceModalOpen, setIsAddMaintenanceModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [filters, setFilters] = useState({
        maintenanceType: "",
        dateRange: { start: "", end: "" },
        costRange: { min: "", max: "" },
    });
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const filterDropdownRef = useRef(null);

    // Authentication check
    useEffect(() => {
        if (!isLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsSidebarExpanded(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
    const toggleFilterDropdown = () => setIsFilterDropdownOpen((prev) => !prev);

    const handleAddMaintenanceClick = () => setIsSelectModalOpen(true);
    const handleCloseSelectModal = () => setIsSelectModalOpen(false);

    const handleVehicleSelected = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsSelectModalOpen(false);
        setIsAddMaintenanceModalOpen(true);
    };

    const handleCloseAddMaintenanceModal = () => {
        setIsAddMaintenanceModalOpen(false);
        setSelectedVehicle(null);
    };

    const handleDeleteMaintenanceRecord = (recordId) => {
        setMaintenanceRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    };

    const handleNewMaintenanceRecord = (record) => {
        setMaintenanceRecords((prevRecords) => [...prevRecords, record]);
        setIsAddMaintenanceModalOpen(false);
        setSelectedVehicle(null);
    };

    const applyFilters = () => {
        return maintenanceRecords.filter((record) => {
            const matchesMaintenanceType =
                !filters.maintenanceType || record.maintenance_type === filters.maintenanceType;
            const matchesDateRange =
                (!filters.dateRange.start || new Date(record.maintenance_date) >= new Date(filters.dateRange.start)) &&
                (!filters.dateRange.end || new Date(record.maintenance_date) <= new Date(filters.dateRange.end));
            const matchesCostRange =
                (!filters.costRange.min || record.cost >= parseFloat(filters.costRange.min)) &&
                (!filters.costRange.max || record.cost <= parseFloat(filters.costRange.max));
            return matchesMaintenanceType && matchesDateRange && matchesCostRange;
        });
    };

    const filteredRecords = applyFilters();

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

    if (isLoading) {
        return <div className="text-center p-4 text-gray-700">Loading...</div>;
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
                      <br></br>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Maintenance & Records
                    </h1>
                    <br></br>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
               
                        <button
                            onClick={handleAddMaintenanceClick}
                            className="w-full md:w-48 h-10 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none"
                        >
                            + Add Maintenance
                        </button>
                        <button
                            onClick={handleExportToExcel}
                            className="w-full md:w-48 h-10 text-sm border-2 border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition duration-200 focus:outline-none"
                        >
                            Export to Excel
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search by vehicle or maintenance type"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 px-4 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        <span className="absolute right-3 top-3 text-gray-400">🔍</span>
                    </div>
                    <button
                        onClick={toggleFilterDropdown}
                        className="flex items-center h-10 px-4 text-sm border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-500 transition duration-200"
                    >
                        <FaFilter className="mr-2" />
                        Filters
                    </button>
                </div>

                {/* Filter Dropdown */}
                {isFilterDropdownOpen && (
                    <div
                        ref={filterDropdownRef}
                        className="absolute top-32 md:top-28 right-4 md:right-6 z-[1000] bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-80 md:w-96 max-h-[80vh] overflow-y-auto"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                        {/* Maintenance Type */}
                        <label className="block mb-4">
                            <span className="text-sm text-gray-700 font-medium">Maintenance Type:</span>
                            <select
                                value={filters.maintenanceType}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        maintenanceType: e.target.value,
                                    }))
                                }
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">All</option>
                                <option value="Oil Change">Oil Change</option>
                                <option value="Brake Repair">Brake Repair</option>
                                <option value="Tire Replacement">Tire Replacement</option>
                                <option value="Battery Replacement">Battery Replacement</option>
                                <option value="General Service">General Service</option>
                                <option value="Engine Tuning">Engine Tuning</option>
                                <option value="Coolant Refill">Coolant Refill</option>
                            </select>
                        </label>

                        {/* Date Range */}
                        <label className="block mb-4">
                            <span className="text-sm text-gray-700 font-medium">Date Range:</span>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, start: e.target.value },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, end: e.target.value },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </label>

                        {/* Cost Range */}
                        <label className="block mb-4">
                            <span className="text-sm text-gray-700 font-medium">Cost Range:</span>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.costRange.min}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            costRange: { ...prev.costRange, min: e.target.value },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.costRange.max}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            costRange: { ...prev.costRange, max: e.target.value },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </label>

                        <button
                            onClick={() => setIsFilterDropdownOpen(false)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}

                {/* Maintenance Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <MaintenanceTable
                     records={filteredRecords} 
                     onDeleteRecord={handleDeleteMaintenanceRecord}
                    maintenanceData={filteredRecords} />
                </div>
            </div>

            {/* Modals */}
            {isSelectModalOpen && (
                <SelectVehicleModal
                    closeModal={handleCloseSelectModal}
                    onSelectVehicle={handleVehicleSelected}
                />
            )}

            {isAddMaintenanceModalOpen && selectedVehicle && (
                <AddMaintenanceModal
                    closeModal={handleCloseAddMaintenanceModal}
                    vehicle={selectedVehicle}
                    onSubmitMaintenance={handleNewMaintenanceRecord}
                />
            )}
        </div>
    );
};

export default Maintenance;