import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi";

const API_URL = "http://localhost:8000/invoice/";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("invoiceInfo");

  // State for all invoice fields
  const [invoiceData, setInvoiceData] = useState({
    date: "",
    invoice_name: "",
    invoice_no: "",
    in_gst: "",
    in_pan: "",
    in_hsn_code: "",
    to_gst: "",
    to_pan: "",
    to_hsn_code: "",
    address: "",
    description: "",
    gross_amount: "",
    state_code: "",
    sgst: "",
    cgst: "",
    igst: "",
    total_amount: "",
    payment_status: "Pending",
  });

  const PAYMENT_STATUS_CHOICES = ["Paid", "Pending", "Cancelled"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsSidebarExpanded(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Handle input change with tax logic
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If user enters SGST or CGST, clear IGST
    if (name === "sgst" || name === "cgst") {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: value,
        igst: value ? "" : prev.igst,
      }));
    }
    // If user enters IGST, clear SGST & CGST
    else if (name === "igst") {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: value,
        sgst: value ? "" : prev.sgst,
        cgst: value ? "" : prev.cgst,
      }));
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields (excluding sgst, cgst, igst)
    for (const key in invoiceData) {
      if (invoiceData[key] === "" && key !== "sgst" && key !== "cgst" && key !== "igst") {
        alert(`Please fill the ${key.replace("_", " ")} field.`);
        return;
      }
    }
    try {
      await axios.post(API_URL, invoiceData);
      alert("Invoice Created Successfully!");
      // Navigate to "generated-invoice" after success
      navigate("/generated");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice.");
    }
  };

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-40 bg-white text-gray-700 hover:text-blue-500 p-3 rounded-full shadow-lg focus:outline-none"
          onClick={toggleSidebar}
        >
          <HiMenu size={28} />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} isMobile={isMobile} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${
          isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
        }`}
      >
        {/* Large Top Navigation */}
        <div className="bg-white shadow-md mb-6">
          <div className="flex justify-between px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
          </div>
          <div className="flex">
            <button
              className={`py-3 px-6 text-lg font-semibold ${
                activeTab === "invoiceInfo"
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("invoiceInfo")}
            >
              Invoice Information
            </button>
            <button
              className={`py-3 px-6 text-lg font-semibold ${
                activeTab === "generatedInvoice"
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => navigate("/generated")}
            >
              Generated Invoice
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {activeTab === "invoiceInfo" && (
            <form onSubmit={handleSubmit}>
              {/* Row 1: date, invoice_no, invoice_name, state_code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["date", "invoice_no", "invoice_name", "state_code"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">
                      {field.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      type={field === "date" ? "date" : "text"}
                      name={field}
                      value={invoiceData[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field.replace("_", " ")}`}
                      className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50"
                    />
                  </div>
                ))}
              </div>

              {/* Row 2: in_gst, in_pan, in_hsn_code, to_gst, to_pan, to_hsn_code */}
              <h3 className="text-lg font-bold mt-6">GST, PAN, HSN Codes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  "in_gst",
                  "in_pan",
                  "in_hsn_code",
                  "to_gst",
                  "to_pan",
                  "to_hsn_code",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">
                      {field.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={invoiceData[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field.replace("_", " ")}`}
                      className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50"
                    />
                  </div>
                ))}
              </div>

              {/* Row 3: address, description */}
              <h3 className="text-lg font-bold mt-6">Address & Description</h3>
              <div className="grid grid-cols-1 gap-6">
                <textarea
                  name="address"
                  value={invoiceData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Address"
                  className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50 w-full"
                />
                <textarea
                  name="description"
                  value={invoiceData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50 w-full"
                />
              </div>

              {/* Row 4: gross_amount, sgst, cgst, igst */}
              <h3 className="text-lg font-bold mt-6">Amounts & Taxes</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {["gross_amount", "sgst", "cgst", "igst"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">
                      {field.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      type="number"
                      name={field}
                      value={invoiceData[field]}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50"
                      // If IGST is filled, disable SGST & CGST
                      // If SGST or CGST is filled, disable IGST
                      disabled={
                        field === "igst"
                          ? !!invoiceData.sgst || !!invoiceData.cgst
                          : !!invoiceData.igst && (field === "sgst" || field === "cgst")
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Row 5: total_amount, payment_status */}
              <h3 className="text-lg font-bold mt-6">Total Amount & Payment Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">TOTAL AMOUNT</label>
                  <input
                    type="number"
                    name="total_amount"
                    value={invoiceData.total_amount}
                    onChange={handleInputChange}
                    placeholder="Enter total"
                    className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">PAYMENT STATUS</label>
                  <select
                    name="payment_status"
                    value={invoiceData.payment_status}
                    onChange={handleInputChange}
                    className="border-2 border-gray-300 p-3 rounded-lg bg-gray-50"
                  >
                    {PAYMENT_STATUS_CHOICES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save & Generate Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 shadow-md"
                >
                  Save 
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
