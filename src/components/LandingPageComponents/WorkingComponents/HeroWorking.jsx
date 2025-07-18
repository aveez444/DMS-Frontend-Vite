import React from "react";
import images from "../../../assets/images";

const HeroWorking = () => {
  return (
    <section
      id="hero-working"
      className="relative h-screen text-white flex flex-col justify-center items-center text-center px-4"
      style={{
        backgroundColor: "black",
        backgroundImage: `url(${images.bggradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative flex flex-col items-center text-center px-4 mt-12 md:mt-16 lg:mt-24">
        {/* Heading */}
        <h1 className="text-5xl sm:text-4xl text-[clamp(1.75rem, 4vw, 3rem)] font-bold mb-4">
          How DMS Helps You to Keep a Track of Your <br /> Sales and Cars
        </h1>

        {/* Description */}
        <p className="text-[clamp(1rem, 1.5vw, 1.25rem)] mb-8 max-w-2xl mx-auto leading-relaxed">
          DMS helps you efficiently track, manage, and analyze all data<br />
          related to your fleet of vehicles or personal cars. From maintenance <br />
          schedules to performance metrics, the provided environment is an <br />
          easy-to-use platform to keep your vehicles running smoothly.
        </p>

        {/* Call-to-Action Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300 flex items-center"
          >
            Get in touch
            <span className="text-blue-500 text-lg font-bold ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroWorking;
