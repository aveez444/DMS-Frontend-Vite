import React, { useState, useEffect, useContext } from "react";
import {
    FaThLarge,
    FaList,
    FaTachometerAlt,
    FaGasPump,
    FaCogs,
    FaTag,
    FaCheckCircle,
    FaParking,
} from "react-icons/fa";
import { HiMenu } from "react-icons/hi"; // Add HiMenu import
import Sidebar from "../DashboardComponents/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const VehicleInventoryViews = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [vehicles, setVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOdometer, setFilterOdometer] = useState("");
    const [filterFuelType, setFilterFuelType] = useState("");
    const [filterTransmission, setFilterTransmission] = useState("");
    const [filterPriceRange, setFilterPriceRange] = useState("");
    const [filterCondition, setFilterCondition] = useState("");
    const [filterParkingSlot, setFilterParkingSlot] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false); // Added for mobile filters
    const vehiclesPerPage = 12;
    const { uuid } = useParams();
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const toggleMobileFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        const fetchVehicles = async () => {
            if (!user) return;
            try {
                setError(null);
                const response = await axiosInstance.get(`/dealership/live-inventory/`);
                const data = response.data;
                console.log("Inventory response:", data);
    
                if (Array.isArray(data)) {
                    // Fetch images for each vehicle
                    const vehiclesWithImages = await Promise.all(
                        data.map(async (vehicle) => {
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
                    setFilteredVehicles(vehiclesWithImages);
                } else {
                    setVehicles([]);
                    setFilteredVehicles([]);
                    setError("No vehicles found");
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    console.log("Session expired, redirecting to login");
                    navigate("/login");
                }
                setError("Failed to load inventory. Please try again.");
                setVehicles([]);
                setFilteredVehicles([]);
            }
        };
    
        fetchVehicles();
    }, [user, navigate]);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = vehicles.filter((vehicle) => {
                return (
                    (!filterOdometer ||
                        parseInt(vehicle.odometer_reading_kms) <= parseInt(filterOdometer)) &&
                    (!filterFuelType ||
                        vehicle.fuel_type?.toLowerCase() === filterFuelType.toLowerCase()) &&
                    (!filterTransmission ||
                        vehicle.transmission_type?.toLowerCase() === filterTransmission.toLowerCase()) &&
                    (!filterPriceRange ||
                        (parseInt(vehicle.purchase_price) >= parseInt(filterPriceRange.split("-")[0]) &&
                            parseInt(vehicle.purchase_price) <= parseInt(filterPriceRange.split("-")[1]))) &&
                    (!filterCondition ||
                        vehicle.condition_grade?.toLowerCase() === filterCondition.toLowerCase()) &&
                    (!filterParkingSlot ||
                        vehicle.storage_location?.toLowerCase().includes(filterParkingSlot.toLowerCase())) &&
                    (!searchTerm ||
                        (vehicle.vehicle_make?.toLowerCase().includes(searchTerm) ||
                            vehicle.vehicle_model?.toLowerCase().includes(searchTerm) ||
                            vehicle.license_plate_number?.toLowerCase().includes(searchTerm)))
                );
            });

            setFilteredVehicles(filtered);
        };

        applyFilters();
    }, [filterOdometer, filterFuelType, filterTransmission, filterPriceRange, filterCondition, filterParkingSlot, searchTerm, vehicles]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleOdometerChange = (e) => setFilterOdometer(e.target.value);
    const handleFuelTypeChange = (e) => setFilterFuelType(e.target.value);
    const handleTransmissionChange = (e) => setFilterTransmission(e.target.value);
    const handlePriceRangeChange = (e) => setFilterPriceRange(e.target.value);
    const handleConditionChange = (e) => setFilterCondition(e.target.value);
    const handleParkingSlotChange = (e) => setFilterParkingSlot(e.target.value);

    const handleViewDetails = (vehicle) => {
        if (vehicle?.vehicle_id) {
            navigate(`/dashboard/${uuid}/inventory/${vehicle.vehicle_id}`);
        } else {
            console.error("Invalid vehicle ID:", vehicle);
        }
    };

    const handleExportToExcel = async () => {
        try {
            const response = await axiosInstance.get(`/dealership/inventory-export/`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "inventory_export.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting to Excel:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                localStorage.removeItem("encrypted_uid");
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
            }
            alert("Failed to export inventory. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const MobileFilters = () => (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl transform transition-transform ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button
                        onClick={toggleMobileFilters}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Odometer</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterOdometer}
                            onChange={handleOdometerChange}
                        >
                            <option value="">All Readings</option>
                            <option value="10000">0 - 10,000 km</option>
                            <option value="20000">10,001 - 20,000 km</option>
                            <option value="50000">20,001 - 50,000 km</option>
                            <option value="100000">50,001 - 100,000 km</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterFuelType}
                            onChange={handleFuelTypeChange}
                        >
                            <option value="">All Types</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterTransmission}
                            onChange={handleTransmissionChange}
                        >
                            <option value="">All Transmissions</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterPriceRange}
                            onChange={handlePriceRangeChange}
                        >
                            <option value="">All Prices</option>
                            <option value="0-500000">₹0 - ₹500,000</option>
                            <option value="500001-1000000">₹500,001 - ₹1,000,000</option>
                            <option value="1000001-2000000">₹1,000,001 - ₹2,000,000</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterCondition}
                            onChange={handleConditionChange}
                        >
                            <option value="">All Conditions</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Damaged">Damaged</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parking Slot</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filterParkingSlot}
                            onChange={handleParkingSlotChange}
                        >
                            <option value="">All Slots</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                        </select>
                    </div>
                    <button
                        onClick={toggleMobileFilters}
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    const VehicleCard = ({ vehicle }) => {
        // Use the first image from vehicle_image_urls, or fallback to placeholder
        const primaryImage = vehicle.vehicle_image_urls && vehicle.vehicle_image_urls.length > 0
            ? vehicle.vehicle_image_urls[0]
            : "https://via.placeholder.com/300x200?text=Vehicle";
    
        return (
            <div
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 ${
                    vehicle.inventory_status === 'IN' ? 'border-t-green-500' : 'border-t-red-500'
                }`}
            >
                <div className="relative">
                    <img
                        src={primaryImage}
                        alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Vehicle"; }}
                    />
                    <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${
                            vehicle.inventory_status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {vehicle.inventory_status}
                    </span>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold">{vehicle.vehicle_make} {vehicle.vehicle_model}</h3>
                            <p className="text-sm text-gray-500">{vehicle.year_of_manufacturing}</p>
                        </div>
                        <p className="font-bold text-blue-600">₹{parseInt(vehicle.purchase_price).toLocaleString()}</p>
                    </div>
                    <div className="my-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center"><FaTachometerAlt className="mr-1 text-gray-500" /> {vehicle.odometer_reading_kms} km</div>
                        <div className="flex items-center"><FaGasPump className="mr-1 text-gray-500" /> {vehicle.fuel_type}</div>
                        <div className="flex items-center"><FaCogs className="mr-1 text-gray-500" /> {vehicle.transmission_type}</div>
                        <div className="flex items-center"><FaParking className="mr-1 text-gray-500" /> {vehicle.storage_location || 'N/A'}</div>
                    </div>
                    <button
                        onClick={() => handleViewDetails(vehicle)}
                        className="w-full mt-2 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-300"
                    >
                        View Details
                    </button>
                </div>
            </div>
        );
    };

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex h-screen bg-gray-100">
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-20 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg"
                    onClick={toggleSidebar}
                >
                    <HiMenu size={24} />
                </button>
            )}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <div
                className={`flex-1 transition-all duration-300 overflow-y-auto ${
                    isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
                <div className="bg-white shadow p-4 sticky top-0 z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h1 className="text-xl font-bold">Inventory</h1>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleExportToExcel}
                                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex-1 min-w-[150px]">
                            <input
                                type="text"
                                placeholder="Search make, model, or plate"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        {isMobile && (
                            <button
                                onClick={toggleMobileFilters}
                                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded flex items-center gap-1"
                            >
                                <FaFilter /> Filters
                            </button>
                        )}
                        <select
                            className="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                        >
                            <option value="grid">Grid</option>
                            <option value="list">List</option>
                        </select>
                    </div>
                    {!isMobile && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-gray-600">Filter:</span>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterOdometer}
                                onChange={handleOdometerChange}
                            >
                                <option value="">Odometer</option>
                                <option value="10000">0-10,000 km</option>
                                <option value="20000">10,001-20,000 km</option>
                                <option value="50000">20,001-50,000 km</option>
                                <option value="100000">50,001-100,000 km</option>
                            </select>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterFuelType}
                                onChange={handleFuelTypeChange}
                            >
                                <option value="">Fuel Type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterTransmission}
                                onChange={handleTransmissionChange}
                            >
                                <option value="">Transmission</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterPriceRange}
                                onChange={handlePriceRangeChange}
                            >
                                <option value="">Price Range</option>
                                <option value="0-500000">₹0-₹500,000</option>
                                <option value="500001-1000000">₹500,001-₹1M</option>
                                <option value="1000001-2000000">₹1M-₹2M</option>
                            </select>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterCondition}
                                onChange={handleConditionChange}
                            >
                                <option value="">Condition</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                                <option value="Damaged">Damaged</option>
                            </select>
                            <select
                                className="px-2 py-1 border border-gray-300 rounded bg-white"
                                value={filterParkingSlot}
                                onChange={handleParkingSlotChange}
                            >
                                <option value="">Parking Slot</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                            </select>
                        </div>
                    )}
                </div>
                {isMobile && <MobileFilters />}
                <div className="p-4">
                    {filteredVehicles.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No vehicles match your filters.</p>
                        </div>
                    )}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {currentVehicles.map((vehicle) => (
                                <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white shadow rounded">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-4 border">Type</th>
                                        <th className="p-4 border">Make</th>
                                        <th className="p-4 border">Model</th>
                                        <th className="p-4 border">Year</th>
                                        <th className="p-4 border">Chassis</th>
                                        <th className="p-4 border">Plate</th>
                                        <th className="p-4 border">Odometer</th>
                                        <th className="p-4 border">Color</th>
                                        <th className="p-4 border">Fuel</th>
                                        <th className="p-4 border">Transmission</th>
                                        <th className="p-4 border">Seller</th>
                                        <th className="p-4 border">Mobile</th>
                                        <th className="p-4 border">Email</th>
                                        <th className="p-4 border">Condition</th>
                                        <th className="p-4 border">Tires</th>
                                        <th className="p-4 border">Damage</th>
                                        <th className="p-4 border">Engine</th>
                                        <th className="p-4 border">Interior</th>
                                        <th className="p-4 border">Arrival</th>
                                        <th className="p-4 border">Price</th>
                                        <th className="p-4 border">Storage</th>
                                        <th className="p-4 border">Notes</th>
                                        <th className="p-4 border">Status</th>
                                        <th className="p-4 border">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentVehicles.map((vehicle) => (
                                        <tr key={vehicle.vehicle_id} className="hover:bg-gray-100">
                                            <td className="p-4 border">{vehicle.vehicle_type}</td>
                                            <td className="p-4 border">{vehicle.vehicle_make}</td>
                                            <td className="p-4 border">{vehicle.vehicle_model}</td>
                                            <td className="p-4 border">{vehicle.year_of_manufacturing}</td>
                                            <td className="p-4 border">{vehicle.chassis_number}</td>
                                            <td className="p-4 border">{vehicle.license_plate_number}</td>
                                            <td className="p-4 border">{vehicle.odometer_reading_kms} km</td>
                                            <td className="p-4 border">{vehicle.color}</td>
                                            <td className="p-4 border">{vehicle.fuel_type}</td>
                                            <td className="p-4 border">{vehicle.transmission_type}</td>
                                            <td className="p-4 border">{vehicle.seller_name_company_name}</td>
                                            <td className="p-4 border">{vehicle.mobile_number}</td>
                                            <td className="p-4 border">{vehicle.email_address}</td>
                                            <td className="p-4 border">{vehicle.condition_grade}</td>
                                            <td className="p-4 border">{vehicle.tires_condition}</td>
                                            <td className="p-4 border">{vehicle.damage_details_if_any}</td>
                                            <td className="p-4 border">{vehicle.engine_condition}</td>
                                            <td className="p-4 border">{vehicle.interior_condition}</td>
                                            <td className="p-4 border">{formatDate(vehicle.arrival_date)}</td>
                                            <td className="p-4 border">₹{vehicle.purchase_price}</td>
                                            <td className="p-4 border">{vehicle.storage_location}</td>
                                            <td className="p-4 border">{vehicle.notes || "N/A"}</td>
                                            <td className="p-4 border">
                                                {vehicle.inventory_status === "IN" ? (
                                                    <span className="text-green-600 font-bold">IN</span>
                                                ) : (
                                                    <span className="text-red-600 font-bold">OUT</span>
                                                )}
                                            </td>
                                            <td className="p-4 border">
                                                <button
                                                    onClick={() => handleViewDetails(vehicle)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === i + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleInventoryViews;