import React, { useState, useEffect } from "react";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <footer
      className="bg-black text-white"
      style={{
        height: isMobile ? "200px" : "270px", // Smaller height for mobile
      }}
    >
      <div className="container mx-auto relative h-full">
        {/* Logo Section */}
        <div
          style={{
            position: isMobile ? "relative" : "absolute",
            left: isMobile ? "50%" : "25%", // Centered for mobile
            top: isMobile ? "unset" : "50%", // Remove vertical centering for mobile
            transform: isMobile ? "translate(-50%, 0)" : "translate(-50%, -50%)", // Adjust based on screen size
          }}
          className="text-center"
        >
          <h1
            className="italic font-bold"
            style={{
              fontSize: isMobile ? "48px" : "96px", // Smaller font size for mobile
            }}
          >
            DMS
          </h1>
          <p
            style={{
              fontSize: isMobile ? "14px" : "18px", // Smaller font size for mobile
            }}
          >
            Dealership Management System
          </p>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            position: isMobile ? "relative" : "absolute",
            right: isMobile ? "50%" : "25%", // Centered for mobile
            top: isMobile ? "unset" : "50%", // Remove vertical centering for mobile
            transform: isMobile ? "translate(50%, 0)" : "translate(50%, -50%)", // Adjust based on screen size
          }}
          className={`${isMobile ? "flex flex-col items-center mt-4" : "text-right"}`}
        >
          <a
            href="#about"
            className="block mb-2 hover:underline"
            style={{
              fontSize: isMobile ? "14px" : "18px", // Adjust font size for mobile
            }}
          >
            About
          </a>
          <a
            href="#features"
            className="block mb-2 hover:underline"
            style={{
              fontSize: isMobile ? "14px" : "18px",
            }}
          >
            Features
          </a>
          <a
            href="#contact"
            className="block hover:underline"
            style={{
              fontSize: isMobile ? "14px" : "18px",
            }}
          >
            Contact us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
