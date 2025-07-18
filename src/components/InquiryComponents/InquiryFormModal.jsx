// File: src/components/InquiryComponents/InquiryFormModal.jsx
import React, { useState } from "react";
import CustomerInquiryForm from "./CustomerInquiryForm";
import BrokerInquiryForm from "./BrokerInquiryForm";

const InquiryFormModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] md:w-[600px] relative">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-gray-700 hover:text-red-500 text-2xl"
        >
          ✖
        </button>

        {/* Toggle Tabs */}
        <div className="flex justify-center border-b mb-4">
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "customer" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
          >
            Customer Inquiry
          </button>
          <button
            onClick={() => setActiveTab("broker")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "broker" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
          >
            Broker Inquiry
          </button>
        </div>

        {/* Render Selected Form */}
        {activeTab === "customer" ? <CustomerInquiryForm closeModal={closeModal} /> : <BrokerInquiryForm closeModal={closeModal} />}
      </div>
    </div>
  );
};

export default InquiryFormModal;
