import React, { useState, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/DashboardComponents/Sidebar";
import Header from "../components/DashboardComponents/Header";
import QuickLinks from "../components/DashboardComponents/QuickLinks";
import InventoryTable from "../components/DashboardComponents/InventoryTable";
import SalesOverview from "../components/DashboardComponents/SalesOverview";
import ExpensesChart from "../components/DashboardComponents/ExpensesChart";
import { FaRegCommentDots } from "react-icons/fa";
import ModalManager from "../components/AddvehicleComponent/ModalManager"; // Adjust the import path

const PopupModal = ({ isOpen, onClose, navigate }) => {
  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-20" 
        onClick={onClose}
      ></div>
      <div className="absolute inset-y-0 right-0 flex items-center justify-end">
        <div className="bg-white rounded-lg w-[400px] max-h-[90vh] mr-5 shadow-xl relative">
          <div className="bg-blue-500 p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">DMS</h2>
                <div className="mt-1">
                  <p className="text-white text-sm">Hi John Doe 👋</p>
                  <p className="text-white text-lg font-semibold">How can we help you?</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl">×</button>
            </div>
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="[Client name's] help centre"
                className="w-full p-2 pr-10 rounded-lg text-sm border-0 focus:ring-0"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 p-1.5 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto max-h-[65vh] scrollbar-hide">
            <h3 className="text-sm font-semibold mb-3">Resources for you</h3>
            <div className="space-y-2">
              {[
                { path: '/help1', title: 'Mastering Inventory Management', desc: 'Effective inventory management is essential for success. This comprehensive guide provides practical tips and strat...' },
                { path: '/help2', title: 'Sharing your Catalog', desc: "In today's fast-paced world, effective time management is essential for success. This comprehensive guide provides..." },
                { path: '/help3', title: 'Other FAQs', desc: "In today's fast-paced world, effective time management is essential for success." },
                { path: '/help4', title: 'Additional Resources', desc: 'Access additional resources and guides to help you maximize your experience with our platform.' }
              ].map((item, index) => (
                <button 
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
            <button className="w-full mt-3 p-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false); // State for Add Vehicle modal

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  };

  const toggleAddVehicleModal = () => {
    setIsAddVehicleModalOpen(!isAddVehicleModalOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isSmallScreen);
      if (!isSmallScreen) {
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-40 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
          onClick={toggleSidebar}
        >
          <HiMenu size={24} />
        </button>
      )}

      <button
        onClick={toggleHelpModal}
        className="fixed bottom-4 right-4 z-[60] bg-blue-500 text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-blue-600 mr-2"
      >
        <FaRegCommentDots size={24} />
      </button>

      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${
          isMobile
            ? ""
            : isSidebarExpanded
            ? "ml-64"
            : "ml-16"
        }`}
      >
        <Header />
        <div className="p-6">
          <QuickLinks />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <InventoryTable />
            <SalesOverview />
          </div>
          <div className="mt-6">
            <ExpensesChart />
          </div>
        </div>
      </div>

      <PopupModal isOpen={isHelpModalOpen} onClose={toggleHelpModal} navigate={navigate} />
      {isAddVehicleModalOpen && <ModalManager onClose={toggleAddVehicleModal} />}
    </div>
  );
};

export default Dashboard;