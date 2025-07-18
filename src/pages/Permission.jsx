import React, { useState, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar from "../components/DashboardComponents/Sidebar";
import Header from "../components/DashboardComponents/Header";
import AssignPermission from "../components/PermissionComponents/AssignPermission";
import ListUsers from "../components/PermissionComponents/ListUsers";
import ListPermissions from "../components/PermissionComponents/ListPermissions";

const Permission = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isSmallScreen);
      if (!isSmallScreen) {
        setIsSidebarExpanded(true); // Expanded by default on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
          onClick={toggleSidebar}
        >
          <HiMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${
          isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
        }`}
      >
        <Header />
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Permission Management</h2>

          {/* Components */}
          <ListUsers />
          <ListPermissions />
          <AssignPermission />
        </div>
      </div>
    </div>
  );
};

export default Permission;
