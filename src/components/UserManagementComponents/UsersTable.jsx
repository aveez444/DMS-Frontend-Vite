import React, { useEffect, useState, useContext } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const UsersTable = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    const fetchUsersData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching users for dealership:", user.tenant);
            const response = await axiosInstance.get(`accounts/api/dealership-users/`, {
                withCredentials: true,
            });
            const data = response.data.users;
            console.log("Users response:", data);
            if (Array.isArray(data)) {
                setUsersData(data);
            } else {
                setUsersData([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("Session expired or unauthorized, redirecting to login");
                localStorage.clear();
                navigate("/login");
            }
            setError("Failed to load users. Please try again.");
            setUsersData([]);
        } finally {
            setLoading(false);
        }
    };

    
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsSidebarExpanded(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    
    // Sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };


    useEffect(() => {
        if (user) {
            fetchUsersData();
        }
    }, [user, navigate]);

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (

        
        <div className="min-h-screen bg-gray-100">
               {/* Main content */}
               <div className="ml-64 p-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Dealership Users</h2>
                        <button
                            onClick={fetchUsersData}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh
                        </button>
                    </div>

                      {/* Sidebar */}
                    <Sidebar
                        isExpanded={isSidebarExpanded}
                        toggleSidebar={toggleSidebar}
                        isMobile={isMobile}
                    />

                    <div
                        className={`flex-1 transition-all duration-300 ${
                        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                        }`}
                    >
                        </div>
                    
                    {/* Search bar - matching the screenshot */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by username or email"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Users table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold">ID</th>
                                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold">Username</th>
                                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold">Email</th>
                                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold">Admin Status</th>
                                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700 font-semibold"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : usersData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    usersData.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 border-b border-gray-200">{user.id}</td>
                                            <td className="py-3 px-4 border-b border-gray-200">{user.username}</td>
                                            <td className="py-3 px-4 border-b border-gray-200">{user.email}</td>
                                            <td className="py-3 px-4 border-b border-gray-200">
                                                {user.is_tenant_admin ? (
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        Regular
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 border-b border-gray-200">
                                          
                                                
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;