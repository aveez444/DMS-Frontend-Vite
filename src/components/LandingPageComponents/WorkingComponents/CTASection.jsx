import React from "react";

const CallToAction = () => {
  return (
    <section
      className="relative py-16 bg-gradient-to-r from-black to-gray-900 text-white text-center"
    >
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Ready to take control of your dealership?
        </h2>
        {/* Subheading */}
        <p className="text-lg sm:text-xl font-light mb-8">
          Sign up now to start managing your fleet with ease!
        </p>
        {/* Call-to-Action Button */}
        <button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300">
          get in touch <span className="text-blue-500 text-lg font-bold ml-2">→</span>
        </button>
      </div>
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </section>
  );
};

export default CallToAction;
