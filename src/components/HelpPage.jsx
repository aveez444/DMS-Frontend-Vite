import React from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "./DashboardComponents/Sidebar";
import { FaSearch, FaBox, FaUserFriends, FaTools, FaCoffee } from "react-icons/fa";
import { BsChatSquareDots, BsTelephone, BsEnvelope } from "react-icons/bs";

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-8 py-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Help</h1>
          <p className="text-gray-500 mb-8">
            Need help? Look through our FAQs to find answers to commonly asked questions, or get in
            touch with our team to get your problem solved.
          </p>

          {/* Search Bar */}
          <div className="bg-gray-50 rounded-lg shadow p-4 mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Search for a question</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your question or search keyword"
                className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12 border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-700">
              Explore the Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FAQ 1 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer" onClick={() => navigate('/help5')}>
                <FaBox className="text-blue-500 text-2xl" />
                <div>
                  <button className="text-md font-semibold text-gray-700">How do I manage my inventory?</button>
                  <p className="text-gray-500 text-sm mt-1">
                    Go into the Inventory section, then view the number of vehicles you have in stock,
                    their details, and you can add or remove vehicles.
                  </p>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer" onClick={() => navigate('/help6')}>
                <FaUserFriends className="text-blue-500 text-2xl" />
                <div>
                  <button className="text-md font-semibold text-gray-700">How do I add my staff?</button>
                  <p className="text-gray-500 text-sm mt-1">
                    You can view the number of vehicles, staff details, and add or remove staff
                    members in the Inventory section.
                  </p>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer" onClick={() => navigate('/help7')}>
                <FaCoffee className="text-blue-500 text-2xl" />
                <div>
                  <button className="text-md font-semibold text-gray-700">Where can I order tea from?</button>
                  <p className="text-gray-500 text-sm mt-1">
                    Unfortunately, DMS does not yet allow tea orders or outside purchases.
                  </p>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer" onClick={() => navigate('/help8')}>
                <FaTools className="text-blue-500 text-2xl" />
                <div>
                  <button className="text-md font-semibold text-gray-700">
                    Can I update maintenance of a car?
                  </button>
                  <p className="text-gray-500 text-sm mt-1">
                    Yes, DMS provides a maintenance feature just for this purpose.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Still need our Help?</h2>
            <p className="text-gray-500 mb-6">
              Send a request, and our team will get in touch with you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact 1 */}
              <div className="text-center">
                <BsChatSquareDots className="text-blue-500 text-4xl mx-auto" />
                <p className="text-gray-600 mt-2">Get help via chat</p>
              </div>

              {/* Contact 2 */}
              <div className="text-center">
                <BsTelephone className="text-blue-500 text-4xl mx-auto" />
                <p className="text-gray-600 mt-2">Call our Customer Support Team</p>
              </div>

              {/* Contact 3 */}
              <div className="text-center">
                <BsEnvelope className="text-blue-500 text-4xl mx-auto" />
                <p className="text-gray-600 mt-2">Email your queries to us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;