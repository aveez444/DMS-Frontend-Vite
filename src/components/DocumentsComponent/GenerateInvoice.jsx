import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi";
import { FaDownload, FaEye } from "react-icons/fa";

const API_URL = "http://localhost:8000/invoice/"; // Change to your actual API URL

const GeneratedInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(API_URL);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);

        // Fallback: Sample Invoice Data
        setInvoices([
          {
            id: 1,
            invoice_no: "INV-001",
            invoice_name: "John Doe",
            total_amount: "1500.00",
            payment_status: "Pending",
            date: "2024-02-21",
            address: "123 Main St, City, Country",
            to_gst: "GST12345678",
          },
          {
            id: 2,
            invoice_no: "INV-002",
            invoice_name: "Jane Smith",
            total_amount: "2500.00",
            payment_status: "Paid",
            date: "2024-02-20",
            address: "456 Elm St, City, Country",
            to_gst: "GST98765432",
          },
        ]);
      }
    };
    fetchInvoices();
  }, []);

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

  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("INVOICE", 90, 20);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoice.invoice_no}`, 140, 30);
    doc.text(`Date: ${invoice.date}`, 140, 36);
    doc.text(`State Code: ${invoice.state_code}`, 140, 42);
  
    // **Tax Details (NOW RIGHT BELOW STATE CODE)**
    doc.setFont("helvetica", "bold");
    doc.text("TAX DETAILS:", 140, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`SGST (${invoice.sgst}%): $${(invoice.gross_amount * invoice.sgst) / 100}`, 140, 60);
    doc.text(`CGST (${invoice.cgst}%): $${(invoice.gross_amount * invoice.cgst) / 100}`, 140, 68);
    doc.text(`IGST (${invoice.igst}%): $${(invoice.gross_amount * invoice.igst) / 100}`, 140, 76);
  
    // **Company & Client Details**
    doc.setFontSize(12);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(invoice.invoice_name, 15, 56);
    doc.text(invoice.address, 15, 62);
    doc.text(`GST: ${invoice.to_gst}`, 15, 70);
    doc.text(`PAN: ${invoice.to_pan}`, 15, 76);
    doc.text(`HSN Code: ${invoice.to_hsn_code}`, 15, 82);
  
    // **Table Headers**
    doc.autoTable({
      startY: 95,
      head: [["Description", "Quantity", "Unit Price", "Total"]],
      body: [
        [invoice.description, "1", `$${invoice.gross_amount}`, `$${invoice.gross_amount}`],
      ],
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    });
  
    // **Total Amount on Right**
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL AMOUNT:", 140, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(`$${invoice.total_amount}`, 180, finalY);
  
    // **Payment Status Below Total Amount**
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PAYMENT STATUS:", 140, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.payment_status, 180, finalY + 10);
  
    // **Footer Message**
    doc.setFontSize(16);
    doc.text("Thank you for your business!", 70, finalY + 30);
  
    doc.save(`Invoice_${invoice.invoice_no}.pdf`);
  };

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-40 bg-white text-gray-700 hover:text-blue-500 p-3 rounded-full shadow-lg focus:outline-none"
          onClick={toggleSidebar}
        >
          <HiMenu size={28} />
        </button>
      )}

      <Sidebar isExpanded={isSidebarExpanded} isMobile={isMobile} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 overflow-auto ${isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"}`}>
        {/* Top Navigation */}
        <div className="bg-white shadow-md mb-6">
          <div className="flex justify-between px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Generated Invoices</h1>
          </div>
          <div className="flex">
            <button
              className="py-3 px-6 text-lg font-semibold text-gray-500"
              onClick={() => navigate("/invoice")}
            >
              Invoice Information
            </button>
            <button className="py-3 px-6 text-lg font-semibold border-b-4 border-blue-500 text-blue-600">
              Generated Invoice
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">All Invoices</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border-b">Invoice No</th>
                    <th className="py-3 px-4 border-b">Invoice Name</th>
                    <th className="py-3 px-4 border-b">Total Amount</th>
                    <th className="py-3 px-4 border-b">Payment Status</th>
                    <th className="py-3 px-4 border-b">View</th>
                    <th className="py-3 px-4 border-b">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3 px-4">{invoice.invoice_no}</td>
                      <td className="py-3 px-4">{invoice.invoice_name}</td>
                      <td className="py-3 px-4">${invoice.total_amount}</td>
                      <td className={`py-3 px-4 ${invoice.payment_status === "Paid" ? "text-green-600" : "text-red-600"} font-semibold`}>
                        {invoice.payment_status}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEye size={20} />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => generatePDF(invoice)} className="text-green-500 hover:text-green-700">
                          <FaDownload size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedInvoices;
