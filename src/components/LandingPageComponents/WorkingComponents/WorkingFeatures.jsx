import React from "react";
import { FaPhone, FaBalanceScale, FaChartBar, FaFolderOpen, FaCar, FaFileInvoice } from "react-icons/fa";
import images from "../../../assets/images"; // Adjust the path to your images.js file

const WorkingFeatures = () => {
  const features = [
    {
      title: "Stay Connected",
      icon: <FaPhone className="text-3xl text-blue-500" />,
      description: "Communicate seamlessly with your team and customers.",
      size: "small",
    },
    {
      title: "Quickly Calculate Profit and Price",
      icon: <FaBalanceScale className="text-3xl text-green-500" />,
      description: "Get accurate insights on your profits with built-in calculators.",
      size: "large",
    },
    {
      title: "Track Sales",
      icon: <FaChartBar className="text-3xl text-purple-500" />,
      description: "Monitor your sales performance with detailed analytics.",
      size: "medium",
    },
    {
      title: "Create & Share Catalog",
      icon: <FaFolderOpen className="text-3xl text-pink-500" />,
      description: "Build and distribute professional catalogs easily.",
      size: "medium",
    },
    {
      title: "Add Your Inventory",
      icon: <FaCar className="text-3xl text-orange-500" />,
      description: "Effortlessly manage and update your inventory in real time.",
      size: "small",
    },
    {
      title: "Send Invoices & Reports",
      icon: <FaFileInvoice className="text-3xl text-teal-500" />,
      description: "Generate invoices and reports with just a few clicks.",
      size: "large",
    },
  ];

  return (
    <section
      id="features"
      className="relative h-auto bg-white text-black py-16"
      style={{
        backgroundImage: `url(${images.bggradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center mb-12">
          What You Can Do with DMS
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white text-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-transform duration-300 ${
                feature.size === "small"
                  ? "sm:col-span-1 h-40"
                  : feature.size === "large"
                  ? "sm:col-span-2 h-40"
                  : "sm:col-span-1.75 h-40"
              }`}
              style={{
                backgroundColor: "white",
                backgroundImage: `linear-gradient(to bottom right, #f0f4f8, #ffffff)`,
              }}
            >
              {/* Icon */}
              <div className="mb-4">{feature.icon}</div>
              {/* Title */}
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              {/* Description */}
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingFeatures;
