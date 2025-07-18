import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Or use fetch if you prefer

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 1) Logout handler
  const handleLogout = async () => {
    try {
      // Example: Make a POST request to your logout endpoint
      // Replace "http://127.0.0.1:8000/api/logout/" with your actual logout URL
      await axios.post("http://127.0.0.1:8000/logout/");

      // If you store a token in localStorage or cookies, clear it here
      localStorage.removeItem("authToken");
      // Or document.cookie = "sessionid=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

      // 2) Navigate to login (or wherever you want after logout)
      navigate("/");

      // 3) Close the dropdown (if open)
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[#F8FAFC] p-4 md:p-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Left: Logo or Branding */}
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/48"
            alt="Logo"
            className="rounded-full object-cover"
            style={{
              width: "clamp(40px, 5vw, 60px)",
              height: "clamp(40px, 5vw, 60px)",
            }}
          />
          <h1
            className="font-semibold text-gray-800"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
          >
            Super Admin
          </h1>
        </div>

        {/* Right: Hamburger Menu with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-white rounded-full shadow-md flex items-center justify-center focus:outline-none"
            style={{
              width: "clamp(32px, 5vw, 40px)",
              height: "clamp(32px, 5vw, 40px)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="gray"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
              <ul className="py-1">
                {/* Manage Users */}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                  onClick={() => {
                    navigate("/dashboard/user");
                    setIsDropdownOpen(false);
                  }}
                >
                  Manage Users
                </li>
                {/* Logout */}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  style={{ fontSize: "clamp(0.875rem, 1vw, 1rem)" }}
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-lg px-4 py-2 max-w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="gray"
          className="mr-2 md:mr-3"
          style={{
            width: "clamp(20px, 4vw, 24px)",
            height: "clamp(20px, 4vw, 24px)",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          style={{
            fontSize: "clamp(0.875rem, 1vw, 1rem)",
          }}
        />
      </div>
    </div>
  );
};

export default Header;
