import React, { useState, useEffect } from "react";
import {
  FaChartLine, // Icon for Sales Tracking
  FaCalculator, // Icon for Calculator
  FaTachometerAlt, // Icon for Dashboard
} from "react-icons/fa";
import images from "../../assets/images"; // Importing images for desktop version

const FeaturesSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  return (
    <>
      {!isMobile ? (
        <section
          id="features"
          className="py-24 mt-0"
          style={{
            backgroundColor: "#ffffff", // Pure white background
            marginTop: "0", // Ensure no gap
          }}
        >
          <div className="container mx-auto max-w-screen-xl px-4 lg:px-8">
            {/* Section Title */}
            <h2 className="text-[40px] font-bold text-center mb-12">
              Explore Features that help you succeed
            </h2>

            {/* Feature 1: Dashboard */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-24">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-[55px] font-bold mb-4 leading-snug">
                  A Dashboard that is easy-to-use
                </h3>
                <p className="text-[20px] text-gray-600">
                  View all sales, inventory, and orders in one place. See what’s selling and what needs attention fast.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={images.picture1}
                  alt="Dashboard Example"
                  className="object-cover"
                  style={{
                    width: "478px",
                    height: "515px",
                  }}
                />
              </div>
            </div>

            {/* Feature 2: Sales Tracking & Reports */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-24">
              <div className="w-full md:w-1/2 flex justify-start">
                <img
                  src={images.picture3}
                  alt="Sales Tracking & Reports"
                  className="w-full md:w-auto object-contain"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[55px] font-bold mb-4 leading-tight">
                  Sales Tracking & Reports
                </h3>
                <p className="text-[20px] text-gray-600">
                  View sales trends instantly to see what’s working.
                </p>
              </div>
            </div>

            {/* Feature 3: Quick Price Calculator */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-24">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-[55px] font-bold mb-4 leading-snug">
                  Quick Price <br /> Calculator
                </h3>
                <p className="text-[20px] text-gray-600">
                  Make pricing easy with our built-in calculator. Give customers quick answers they can trust.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={images.picture5}
                  alt="Quick Price Calculator"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Additional Features Section */}
            <h2 className="text-[55px] font-bold text-center mb-12">And there’s more..</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {/* Image 1 */}
              <img
                src={images.picture7}
                alt="Easy Money Reports"
                style={{
                  width: "729px",
                  height: "355px",
                }}
              />

              {/* Image 2 */}
              <img
                src={images.picture8}
                alt="Team Sync"
                style={{
                  width: "387px",
                  height: "355px",
                }}
              />

              {/* Image 3 */}
              <img
                src={images.picture9}
                alt="Inventory Management"
                style={{
                  width: "528px",
                  height: "355px",
                }}
              />

              {/* Image 4 */}
              <img
                src={images.picture10}
                alt="Finish Tasks"
                style={{
                  width: "583px",
                  height: "355px",
                }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section
          id="features-mobile"
          className="py-12"
          style={{
            backgroundColor: "#ffffff", // Pure white background for mobile
            marginTop: "-20px", // To overlap slightly with the previous section
            paddingBottom: "32px", // Ensure spacing below the section
          }}
        >
          <div className="container mx-auto text-justify px-6 space-y-8">
            <h2 className="text-[32px] font-bold text-center mb-6">
              All the tools you need
            </h2>
            <div className="space-y-10">
              {/* Feature 1 */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <FaTachometerAlt size={32} className="text-blue-500" />
                  <h3 className="text-[20px] font-bold">Easy-to-use Dashboard</h3>
                </div>
                <p className="text-[18px] text-gray-600">
                  View all sales, inventory, and orders in one place.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <FaChartLine size={32} className="text-red-500" />
                  <h3 className="text-[20px] font-bold">Sales Tracking & Reports</h3>
                </div>
                <p className="text-[18px] text-gray-600">
                  View sales trends instantly to see what’s working.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <FaCalculator size={32} className="text-green-500" />
                  <h3 className="text-[20px] font-bold">Quick Price Calculator</h3>
                </div>
                <p className="text-[18px] text-gray-600">
                  Make pricing easy with our built-in calculator.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturesSection;
