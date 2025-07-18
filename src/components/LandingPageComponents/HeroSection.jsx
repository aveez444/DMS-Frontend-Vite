import React from "react";
import images from "../../assets/images";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative h-screen bg-gradient-to-r from-black to-gray-800 text-white flex flex-col justify-center items-center text-center px-4"
    >
      <div className="relative flex flex-col items-center text-center px-4 mt-[-40px] sm:mt-[-60px] lg:mt-[-80px]">
        <h1 className="text-5xl sm:text-4xl text-[clamp(1.75rem, 4vw, 3rem)] font-bold mb-4">
          Run Your Dealership Faster and Easier
        </h1>

        <p className="text-[clamp(1rem, 1.5vw, 1.25rem)] mb-8 max-w-2xl mx-auto leading-relaxed text-center">
          Our tool helps you track cars, sales, and money—all in one place. <br /> Say goodbye to messy spreadsheets and paperwork.
        </p>

        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300 flex items-center"
            onClick={() => navigate('/working')}
          
          >
            See how it works
            <span className="text-blue-500 text-lg font-bold ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="absolute w-full flex justify-center items-center gap-4 lg:gap-8 bottom-[-50px] sm:bottom-[-75px]">
        {/* Left Image */}
        <div className="hidden lg:block relative z-10 transform translate-y-12">
          <img
            src={images.landingpage1}
            alt="Cars parked"
            className="w-[clamp(150px, 25vw, 350px)] h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Middle Image */}
        <div className="relative z-20 transform scale-110 translate-y-8">
          <img
            src={images.landingpage2}
            alt="Dashboard view"
            className="w-[clamp(250px, 50vw, 600px)] h-auto rounded-lg shadow-xl object-cover"
          />
        </div>

        {/* Right Image */}
        <div className="hidden lg:block relative z-10 transform translate-y-12">
          <img
            src={images.landingpage3}
            alt="Customer discussion"
            className="w-[clamp(150px, 25vw, 350px)] h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
