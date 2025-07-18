import React from "react";
import images from "../../../assets/images"; // Import the gradient background from your images.js

const ComparisonTable = () => {
  const rows = [
    {
      feature: "Inventory Management",
      withDMS: "📦 Real-time tracking",
      withoutDMS: "❌ Manual spreadsheets",
    },
    {
      feature: "Catalogs",
      withDMS: "📂 Instant sharing",
      withoutDMS: "🕒 Time-consuming setup",
    },
    {
      feature: "Pricing",
      withDMS: "💰 Built-in calculators",
      withoutDMS: "⚠️ Risk of errors",
    },
    {
      feature: "Sales Tracking",
      withDMS: "📈 Detailed analytics",
      withoutDMS: "🔍 Guesswork",
    },
    {
      feature: "Maintenance",
      withDMS: "🛠️ Automated reminders",
      withoutDMS: "😓 Missed tasks",
    },
    {
      feature: "Invoicing",
      withDMS: "📄 Digital invoices",
      withoutDMS: "🖊️ Manual entries",
    },
    {
      feature: "User Management",
      withDMS: "👥 Role assignments",
      withoutDMS: "🔓 No permissions control",
    },
    {
      feature: "Efficiency",
      withDMS: "⚡ Save time",
      withoutDMS: "⏳ Slow processes",
    },
    {
      feature: "Professionalism",
      withDMS: "✨ Polished materials",
      withoutDMS: "📉 Unorganized",
    },
    {
      feature: "Decision-Making",
      withDMS: "📊 Data-driven insights",
      withoutDMS: "🤔 Difficult analysis",
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundImage: `url(${images.bggradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center mb-12 text-black">
          Why Choose DMS Over Traditional Methods
        </h2>

        {/* Centered Table Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gradient-to-r from-green-100 via-white to-red-100 text-gray-800">
              <div className="p-4 font-bold text-lg border-r">Feature</div>
              <div className="p-4 font-bold text-lg border-r text-green-700">
                With DMS
              </div>
              <div className="p-4 font-bold text-lg text-red-700">
                Without DMS
              </div>
            </div>

            {rows.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {/* Feature */}
                <div className="p-4 font-medium border-r">{row.feature}</div>

                {/* With DMS */}
                <div className="p-4 border-r text-green-700 flex items-center space-x-2">
                  <span>{row.withDMS}</span>
                </div>

                {/* Without DMS */}
                <div className="p-4 text-red-700 flex items-center space-x-2">
                  <span>{row.withoutDMS}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
