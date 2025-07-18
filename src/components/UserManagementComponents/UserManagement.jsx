import React, { useState, useEffect } from "react";
import Sidebar from "../DashboardComponents/Sidebar";
import { HiMenu } from "react-icons/hi";
import { HiOutlineFilter } from "react-icons/hi";
import AddUserWizard from "./AddUserWizard"; // Use the multi-step wizard

const SearchFilterBar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex items-center w-full md:w-[1154px] mb-6 space-x-4">
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 px-4 py-2 h-[40px] md:h-[48px] border border-gray-300 rounded-md shadow-sm text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button className="flex items-center justify-center px-4 py-2 h-[40px] md:h-[48px] border border-gray-300 rounded-md text-gray-700 hover:text-blue-500 hover:border-blue-400 transition duration-300">
      <HiOutlineFilter className="mr-2" />
      Filters
    </button>
  </div>
);

const UserTable = ({ users }) => (
  <div className="bg-white rounded-md shadow-md overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-gray-700 text-sm md:text-base">
          <th className="px-4 py-2 text-left">User Name</th>
          <th className="px-4 py-2 text-left">Role</th>
          <th className="px-4 py-2 text-left">Access</th>
          <th className="px-4 py-2 text-left">Last Active</th>
          <th className="px-4 py-2 text-left">Date Added</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr key={index} className="border-b text-sm md:text-base hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{user.role}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {user.access.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs md:text-sm bg-blue-100 text-blue-600 rounded-md mr-2"
                  >
                    {item}
                  </span>
                ))}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{user.lastActive}</td>
              <td className="px-4 py-2 whitespace-nowrap">{user.dateAdded}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-600">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const UserManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAddUserWizardOpen, setIsAddUserWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([
    {
      name: "John Doe",
      role: "Super Admin",
      access: ["Data Export", "Inventory", "Sales", "Add/Remove users", "Accounts"],
      lastActive: "Nov 28, 2024",
      dateAdded: "Nov 8, 2024",
    },
    {
      name: "Jane Smith",
      role: "Sales",
      access: ["Data Export", "Inventory", "Sales"],
      lastActive: "Nov 28, 2024",
      dateAdded: "Nov 8, 2024",
    },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler after adding a user in the wizard (mock)
  const handleUserAdded = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Hamburger Menu */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-lg focus:outline-none"
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
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-[24px] md:text-[32px] text-gray-700 font-semibold">
              User Management
            </h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setIsAddUserWizardOpen(true)}
                className="px-4 py-2 w-auto md:w-[214px] h-[40px] md:h-[48px] text-sm md:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                + Add User
              </button>
              <button
                className="px-4 py-2 w-auto md:w-[214px] h-[40px] md:h-[48px] text-sm md:text-base border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-100 transition duration-300"
              >
                Remove User
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <SearchFilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* User Table */}
          <UserTable users={filteredUsers} />
        </div>
      </div>

      {isAddUserWizardOpen && (
        <AddUserWizard
          isOpen={isAddUserWizardOpen}
          onClose={() => setIsAddUserWizardOpen(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
};

export default UserManagement;
