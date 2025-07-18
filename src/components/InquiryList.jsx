import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi"; // Added missing import for HiMenu

const InquiryList = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [customerInquiries, setCustomerInquiries] = useState([]);
  const [brokerInquiries, setBrokerInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [error, setError] = useState("");
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

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
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      setIsSidebarExpanded(!isNowMobile); // Collapse sidebar on mobile, expand on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Fetch inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError("");
        const customerResponse = await axiosInstance.get("/dealership/vehicle-inquiries/");
        const brokerResponse = await axiosInstance.get("/dealership/inquiry-brokers/");

        setCustomerInquiries(Array.isArray(customerResponse.data) ? customerResponse.data : []);
        setBrokerInquiries(Array.isArray(brokerResponse.data) ? brokerResponse.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inquiries:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          console.log("Session expired, redirecting to login");
          localStorage.removeItem("session_id");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError("Failed to fetch inquiries.");
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user, navigate]);

  if (authLoading || loading) {
    return <div className="text-center p-4 text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded && !isMobile ? "ml-64" : isMobile ? "ml-0" : "ml-16"
        } p-6`}
      >
        {/* Mobile Sidebar Toggle */}
        {isMobile && (
          <button
            className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
            onClick={toggleSidebar}
          >
            <HiMenu size={24} />
          </button>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center">Inquiries List</h2>

        {/* Tabs for Customer and Broker Inquiries */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-6 py-2 mx-2 rounded-md ${
              activeTab === "customer" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer Inquiries
          </button>
          <button
            className={`px-6 py-2 mx-2 rounded-md ${
              activeTab === "broker" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("broker")}
          >
            Broker Inquiries
          </button>
        </div>

        {/* Customer Inquiries Table */}
        {activeTab === "customer" && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-4">Name</th>
                  <th className="border p-4">Contact</th>
                  <th className="border p-4">Vehicle Name</th>
                  <th className="border p-4">Budget</th>
                  <th className="border p-4">Model</th>
                </tr>
              </thead>
              <tbody>
                {customerInquiries.length > 0 ? (
                  customerInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border">
                      <td className="border p-4">{inquiry.name}</td>
                      <td className="border p-4">{inquiry.contact}</td>
                      <td className="border p-4">{inquiry.Vehicle_name}</td>
                      <td className="border p-4">₹{inquiry.budget}</td>
                      <td className="border p-4">{inquiry.model}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border p-4 text-center text-gray-500">
                      No customer inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Broker Inquiries Table */}
        {activeTab === "broker" && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-4">Company</th>
                  <th className="border p-4">Name</th>
                  <th className="border p-4">Contact</th>
                </tr>
              </thead>
              <tbody>
                {brokerInquiries.length > 0 ? (
                  brokerInquiries.map((broker) => (
                    <tr key={broker.id} className="border">
                      <td className="border p-4">{broker.company || "N/A"}</td>
                      <td className="border p-4">{broker.name}</td>
                      <td className="border p-4">{broker.contact}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border p-4 text-center text-gray-500">
                      No broker inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryList;