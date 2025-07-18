import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [stats, setStats] = useState(null);
  const [outboundVehicles, setOutboundVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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

  const fetchSalesData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch sales statistics
      const statsResponse = await axiosInstance.get("/dealership/sales-stats/", {
        withCredentials: true,
      });
      setStats(statsResponse.data);

      // Fetch outbound vehicles
      const outboundResponse = await axiosInstance.get("/dealership/live-inventory/", {
        withCredentials: true,
      });
      const vehicles = outboundResponse.data;
      const outboundVehiclesData = vehicles.filter(v => v.inventory_status === "OUT").map(vehicle => ({
        ...vehicle,
        buyers_name: vehicle.buyers_name || "Unknown",
        selling_price: vehicle.selling_price || "0",
        outbound_date: vehicle.outbound_date || null,
        delivery_status: vehicle.delivery_status || "Pending",
      }));
      setOutboundVehicles(outboundVehiclesData);
    } catch (err) {
      console.error("Error fetching sales data:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
      setError("Failed to load sales data. Please try again.");
      setStats(null);
      setOutboundVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSalesData();
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDateRangeChange = (e) => {
    setFilterDateRange(e.target.value);
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axiosInstance.get("/dealership/inventory-export/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales_export.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error.response?.data || error.message);
      alert("Failed to export sales data. Please try again.");
    }
  };

  const filteredOrders = outboundVehicles.filter((vehicle) => {
    const matchesSearch = (
      vehicle.vehicle_make?.toLowerCase().includes(searchTerm) ||
      vehicle.vehicle_model?.toLowerCase().includes(searchTerm) ||
      vehicle.license_plate_number?.toLowerCase().includes(searchTerm) ||
      vehicle.buyers_name?.toLowerCase().includes(searchTerm)
    );
    const matchesDate = filterDateRange
      ? vehicle.outbound_date && new Date(vehicle.outbound_date).toISOString().slice(0, 7) === filterDateRange
      : true;
    return matchesSearch && matchesDate;
  });

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales Revenue (₹)",
        data: stats?.monthly_sales || Array(12).fill(0),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Revenue (₹)" } },
      x: { title: { display: true, text: "Month" } },
    },
  };

  const doughnutChartData = {
    labels: ["Purchase Price", "Other Expenses", "Profit"],
    datasets: [
      {
        data: [
          stats?.total_purchase_price || 0,
          stats?.total_other_expenses || 0,
          Math.max(0, (stats?.total_sales_revenue || 0) - (stats?.total_purchase_price || 0) - (stats?.total_other_expenses || 0)),
        ],
        backgroundColor: ["#EF4444", "#FBBF24", "#3B82F6"],
        hoverOffset: 20,
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  const MobileFilters = () => (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-xl transition-transform duration-300 ${showMobileFilters ? "translate-y-0" : "translate-y-full"}`} style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          <button onClick={toggleMobileFilters} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterDateRange}
              onChange={handleDateRangeChange}
            >
              <option value="">All Dates</option>
              <option value="2025-01">January 2025</option>
              <option value="2025-02">February 2025</option>
              <option value="2025-03">March 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-05">May 2025</option>
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
            <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Vehicles", value: stats?.total_vehicles || 0, color: "bg-purple-500" },
                { label: "In Inventory", value: stats?.total_in_inventory || 0, color: "bg-blue-500" },
                { label: "Sold Vehicles", value: stats?.total_outbound || 0, color: "bg-red-500" },
                { label: "Total Sales", value: `₹${(stats?.total_sales_revenue || 0).toLocaleString()}`, color: "bg-green-500" },
              ].map((card, index) => (
                <div
                  key={index}
                  className={`${card.color} text-white p-4 rounded-lg shadow-md flex flex-col items-center text-center transform hover:scale-105 transition duration-200`}
                >
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                  <p className="text-sm">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend (Last 12 Months)</h3>
                <div className="h-80">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Breakdown</h3>
                <div className="h-64">
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search make, model, plate, or buyer"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
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
                      value={filterDateRange}
                      onChange={handleDateRangeChange}
                    >
                      <option value="">All Dates</option>
                      <option value="2025-01">January 2025</option>
                      <option value="2025-02">February 2025</option>
                      <option value="2025-03">March 2025</option>
                      <option value="2025-04">April 2025</option>
                      <option value="2025-05">May 2025</option>
                    </select>
                  )}
                  <button
                    onClick={handleExportToExcel}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Buyer</th>
                      <th className="py-3 px-4">Selling Price</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((vehicle, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{`${vehicle.vehicle_make || "N/A"} ${vehicle.vehicle_model || "N/A"}`}</td>
                          <td className="py-3 px-4">{vehicle.buyers_name}</td>
                          <td className="py-3 px-4">₹{(parseFloat(vehicle.selling_price) || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">{vehicle.outbound_date ? new Date(vehicle.outbound_date).toLocaleDateString("en-GB") : "N/A"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                vehicle.delivery_status === "Delivered" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {vehicle.delivery_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">
                          No sales found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {isMobile && <MobileFilters />}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;