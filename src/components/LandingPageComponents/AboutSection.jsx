import React, { useState, useEffect } from "react";
import images from "../../assets/images";

const AboutSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Effect to detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Check if screen width is less than md breakpoint
    };

    // Initial check and event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Don't render the section on mobile
  if (isMobile) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-transparent to-white -mt-40 pt-12"
    >
      <div className="container mx-auto max-w-screen-xl px-2 lg:px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
              ABOUT
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-snug">
            Imagine everything you need, in one place
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Whether you need to track maintenance, simplify inventory
            management, or share a sleek catalog with customers, <br />
            <span className="font-semibold italic">We’ve got you covered.</span>
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300">
            Schedule a demo
          </button>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={images.aboutimg}
            alt="About section car"
            className="w-[500px] h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

