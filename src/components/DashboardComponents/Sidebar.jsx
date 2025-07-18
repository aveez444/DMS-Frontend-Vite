import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AiFillHome } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { MdBuild } from "react-icons/md";
import { RiTruckLine } from "react-icons/ri";
import { BiBarChartAlt2 } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsClipboardData } from "react-icons/bs";
import { MdUpdate } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const Sidebar = ({ isExpanded, toggleSidebar, isMobile }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userUuid, setUserUuid] = useState("");

    useEffect(() => {
        if (user && user.uuid) {
            setUserUuid(user.uuid);
            localStorage.setItem("user_uuid", user.uuid);
        } else {
            const storedUuid = localStorage.getItem("user_uuid");
            if (storedUuid) {
                setUserUuid(storedUuid);
            }
        }
    }, [user]);

    const getRouteWithUuid = (baseRoute) => {
        if (!userUuid) return baseRoute;
        if (baseRoute === "/dashboard") {
            return `/dashboard/${userUuid}`;
        }
        if (baseRoute === "/user") {
            return `/user/${userUuid}`;
        }
        if (baseRoute.startsWith("/")) {
            return `/dashboard/${userUuid}${baseRoute}`;
        }
        return baseRoute;
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { name: "Home", icon: <AiFillHome />, route: "/dashboard", alwaysVisible: true },
        { name: "Inventory", icon: <FiFileText />, route: "/inventory", alwaysVisible: true },
        { name: "User", icon: <FaUsers />, route: "/user", alwaysVisible: true },
        { name: "Maintenance", icon: <MdBuild />, route: "/maintenance", alwaysVisible: true },
        { name: "Outbound", icon: <RiTruckLine />, route: "/outbound", alwaysVisible: true },
        { name: "Sales", icon: <BiBarChartAlt2 />, route: "/sales", alwaysVisible: true },
        { name: "Due Payments", icon: <BsClipboardData />, route: "/due-payments", alwaysVisible: true },
        { name: "Inquiries", icon: <BsQuestionCircleFill />, route: "/inquiry", alwaysVisible: true },
        { name: "Updates Management", icon: <MdUpdate />, route: "/updates-management", alwaysVisible: true },
        { name: "Settings", icon: <IoSettingsSharp />, route: "/settings", alwaysVisible: true },
        { name: "Logout", icon: <FiLogOut />, action: handleLogout, alwaysVisible: true },
    ];

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-screen bg-white shadow-md z-50 transition-transform duration-300 ${
                    isExpanded ? "translate-x-0 w-64" : isMobile ? "-translate-x-full w-64" : "w-16"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="text-xl font-bold text-gray-800">
                        {isExpanded ? "DMS" : "D"}
                    </div>
                    <button
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={toggleSidebar}
                    >
                        {isExpanded ? "←" : "→"}
                    </button>
                </div>

                <ul className="mt-4 space-y-2 px-2">
                    {menuItems.map((item, index) =>
                        item.alwaysVisible && (
                            item.action ? (
                                <button
                                    key={index}
                                    onClick={item.action}
                                    className="flex items-center p-3 rounded-md transition-colors duration-200 text-gray-700 hover:bg-blue-100 w-full text-left"
                                >
                                    <div className="text-xl">{item.icon}</div>
                                    {isExpanded && <span className="ml-4 text-sm">{item.name}</span>}
                                </button>
                            ) : (
                                <NavLink
                                    to={getRouteWithUuid(item.route)}
                                    key={index}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-md transition-colors duration-200 ${
                                            isActive ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700"
                                        } hover:bg-blue-100`
                                    }
                                    end={item.route === "/dashboard"}
                                >
                                    <div className="text-xl">{item.icon}</div>
                                    {isExpanded && <span className="ml-4 text-sm">{item.name}</span>}
                                </NavLink>
                            )
                        )
                    )}
                </ul>
            </div>

            {isMobile && isExpanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;