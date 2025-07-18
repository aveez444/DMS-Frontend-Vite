import React, { useState, useEffect } from "react";
import images from "../../assets/images";

const ScrollingTextSection = ({ sections, handleDemoNavigation }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="scrolling-text"
      className={`relative ${isMobile ? "py-16" : "h-screen"} text-black flex items-center justify-center`}
      style={{
        background: isMobile
          ? "#ffffff" // Mobile: pure white background
          : `linear-gradient(to bottom, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 1) 100%), url(${images.bggradient})`, // Large screens: gradient + bg image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isMobile ? (
        <div className="w-full px-6 space-y-8 mt-16"> {/* Adjusted spacing with mt-16 */}
          {sections.map((section, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
              style={{
                backgroundImage: `url(${images.bggradient})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Title */}
              {section.title && (
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
              )}

              {/* Description */}
              {section.lines &&
                section.lines.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-base text-gray-600 leading-relaxed">
                    {line}
                  </p>
                ))}

              {/* Button */}
              {section.button && (
                <div className="mt-6">
                  <button
                    onClick={handleDemoNavigation}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
                  >
                    See how it works
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full max-w-lg h-60 overflow-y-auto mx-auto no-scrollbar mask-gradient leading-8 text-center snap-y snap-mandatory">
          <p className="snap-start">&nbsp;</p>

          {/* Dynamic Content */}
          {sections.map((section, index) => (
            <div key={section.id}>
              {section.title && (
                <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
              )}

              {section.lines &&
                section.lines.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-lg">
                    {line}
                  </p>
                ))}

              {section.button && (
                <button
                  onClick={handleDemoNavigation}
                  className="mt-8 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  See how it works
                  <span className="text-blue-500 font-bold text-xl ml-2">→</span>
                </button>
              )}
            </div>
          ))}

          <p className="snap-start">&nbsp;</p>
        </div>
      )}
    </section>
  );
};

export default ScrollingTextSection;
