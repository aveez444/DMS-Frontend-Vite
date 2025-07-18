import React from "react";

const Header = ({ handleExportToExcel, viewMode, setViewMode, searchTerm, handleSearch }) => {
  return (
    <div className="bg-white shadow-sm p-6 sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Title and Buttons Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
              + Add Vehicle
            </button>
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Search and View Toggle Row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 flex items-center"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
