import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import { FaSearch, FaFilter, FaFileDownload, FaImage } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

const Documents = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [documents, setDocuments] = useState({
    vehicleDocs: [],
    buyerDocs: [],
    maintenanceDocs: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSidebarExpanded(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fetchVehicles = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/dealership/live-inventory/", {
        withCredentials: true,
      });
      const vehiclesData = response.data;
      if (Array.isArray(vehiclesData)) {
        setVehicles(vehiclesData);
      } else {
        setVehicles([]);
        setError("No vehicles found");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
      setError("Failed to load vehicles. Please try again.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (vehicleId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vehicle details
      const vehicleResponse = await axiosInstance.get(`/dealership/vehicle-detail/${vehicleId}/`, {
        withCredentials: true,
      });
      const vehicleData = vehicleResponse.data;

      // Fetch outbound vehicle details (for buyer documents)
      let buyerDocs = [];
      try {
        const outboundResponse = await axiosInstance.get(`/dealership/outbound-vehicle/${vehicleId}/`, {
          withCredentials: true,
        });
        if (outboundResponse.data.buyers_proof_of_identity) {
          buyerDocs = [{ name: "Proof of Identity", url: outboundResponse.data.buyers_proof_of_identity }];
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error fetching outbound vehicle:", err.response?.data || err.message);
        }
      }

      // Fetch maintenance records
      const maintenanceResponse = await axiosInstance.get(`/dealership/maintenance/${vehicleId}/`, {
        withCredentials: true,
      });
      const maintenanceDocs = Array.isArray(maintenanceResponse.data)
        ? maintenanceResponse.data
            .filter(record => record.receipt_url)
            .map(record => ({
              name: `${record.maintenance_type} Receipt (${record.maintenance_date})`,
              url: record.receipt_url,
            }))
        : [];

      setDocuments({
        vehicleDocs: [
          vehicleData.proof_of_ownership_url && {
            name: "Proof of Ownership",
            url: vehicleData.proof_of_ownership_url,
          },
          vehicleData.purchase_agreement_url && {
            name: "Purchase Agreement",
            url: vehicleData.purchase_agreement_url,
          },
          vehicleData.vehicle_image_url && {
            name: "Vehicle Image",
            url: vehicleData.vehicle_image_url,
            isImage: true,
          },
        ].filter(Boolean),
        buyerDocs,
        maintenanceDocs,
      });
    } catch (err) {
      console.error("Error fetching documents:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
      setError("Failed to load documents. Please try again.");
      setDocuments({ vehicleDocs: [], buyerDocs: [], maintenanceDocs: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    fetchDocuments(vehicle.vehicle_id);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = (
      vehicle.vehicle_make?.toLowerCase().includes(searchTerm) ||
      vehicle.vehicle_model?.toLowerCase().includes(searchTerm) ||
      vehicle.license_plate_number?.toLowerCase().includes(searchTerm)
    );
    const matchesStatus = filterStatus ? vehicle.inventory_status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const MobileFilters = () => (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-xl transition-transform duration-300 ${showMobileFilters ? "translate-y-0" : "translate-y-full"}`} style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          <button onClick={toggleMobileFilters} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={handleStatusFilter}
            >
              <option value="">All Statuses</option>
              <option value="IN">In Inventory</option>
              <option value="OUT">Sold</option>
            </select>
          </div>
          <button
            onClick={toggleMobileFilters}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  const DocumentModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Documents for {selectedVehicle?.vehicle_make} {selectedVehicle?.vehicle_model} ({selectedVehicle?.license_plate_number})
          </h2>
          <button onClick={() => setSelectedVehicle(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">✕</button>
        </div>
        <div className="space-y-6">
          {/* Vehicle Documents */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Vehicle Documents</h3>
            {documents.vehicleDocs.length > 0 ? (
              <ul className="space-y-2">
                {documents.vehicleDocs.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      {doc.isImage ? <FaImage className="text-gray-500" /> : <FaFileDownload className="text-gray-500" />}
                      <span>{doc.name}</span>
                    </div>
                    {doc.isImage ? (
                      <img src={doc.url} alt={doc.name} className="w-20 h-20 object-cover rounded-md" />
                    ) : (
                      <a href={doc.url} download className="text-blue-500 hover:underline">Download</a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No vehicle documents available.</p>
            )}
          </div>

          {/* Buyer Documents */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Buyer Documents</h3>
            {documents.buyerDocs.length > 0 ? (
              <ul className="space-y-2">
                {documents.buyerDocs.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FaFileDownload className="text-gray-500" />
                      <span>{doc.name}</span>
                    </div>
                    <a href={doc.url} download className="text-blue-500 hover:underline">Download</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No buyer documents available.</p>
            )}
          </div>

          {/* Maintenance Documents */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Maintenance Records</h3>
            {documents.maintenanceDocs.length > 0 ? (
              <ul className="space-y-2">
                {documents.maintenanceDocs.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FaFileDownload className="text-gray-500" />
                      <span>{doc.name}</span>
                    </div>
                    <a href={doc.url} download className="text-blue-500 hover:underline">Download</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No maintenance records available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          <HiMenu size={24} />
        </button>
      )}

      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      <div className={`flex-1 p-6 ${isMobile ? "pt-16" : isSidebarExpanded ? "ml-64" : "ml-16"}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg font-semibold text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg font-semibold text-red-500">{error}</div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Documents</h1>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search make, model, or plate"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {isMobile ? (
                  <button
                    onClick={toggleMobileFilters}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-200"
                  >
                    <FaFilter /> Filters
                  </button>
                ) : (
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={handleStatusFilter}
                  >
                    <option value="">All Statuses</option>
                    <option value="IN">In Inventory</option>
                    <option value="OUT">Sold</option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.vehicle_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <img
                      src={vehicle.vehicle_image_url || "https://via.placeholder.com/300x200?text=Vehicle"}
                      alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}</h3>
                      <p className="text-sm text-gray-500">{vehicle.license_plate_number}</p>
                      <p className="text-sm text-gray-500">
                        Status: <span className={vehicle.inventory_status === "IN" ? "text-green-600" : "text-red-600"}>{vehicle.inventory_status}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No vehicles match your filters.
                </div>
              )}
            </div>

            {selectedVehicle && <DocumentModal />}
            {isMobile && <MobileFilters />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;