import React, { useState } from "react";
import SignUp from "../SignUp"; // Importing SignUp component
import images from "../../assets/images"; // Importing images.js file

const GetStartedSection = () => {
  const [showSignUpModal, setShowSignUpModal] = useState(false); // State to toggle modal
  const [enteredEmail, setEnteredEmail] = useState(""); // State to capture entered email

  // Handle the Sign-Up logic
  const handleSignUp = (name, email, password) => {
    console.log("User signed up with:", { name, email, password });
    // Add your API call or additional sign-up logic here
  };

  return (
    <>
      <section
        className="relative pt-20" // Added padding-top here
        style={{
          height: "323px",
          backgroundImage: `url(${images.getstartedbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-0">
          {/* Title */}
          <h2 className="text-[24px] sm:text-[32px] font-bold text-white mb-4">
            Get Started
          </h2>
          {/* Description */}
          <p className="text-[16px] sm:text-[24px] text-white mb-6 sm:mb-8 max-w-full sm:max-w-2xl">
            Contact our team to learn more about whether DMS is a good tool for
            your dealership’s success or not
          </p>
          {/* Input and Button in the Same Box */}
          <div
            className="flex items-center bg-white shadow-lg w-full sm:w-[626px] rounded-lg"
            style={{
              height: "54px",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={enteredEmail} // Controlled input
              onChange={(e) => setEnteredEmail(e.target.value)}
              className="flex-1 px-4 text-gray-800 bg-transparent focus:outline-none text-[14px] sm:text-[16px]"
              style={{
                height: "100%",
              }}
            />
            <button
              onClick={() => setShowSignUpModal(true)} // Show the Sign Up modal
              className="bg-black text-white font-semibold hover:bg-gray-800 transition duration-300 rounded-r-lg"
              style={{
                minWidth: "87px",
                height: "100%",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>
      <SignUp
        showModal={showSignUpModal}
        closeModal={() => setShowSignUpModal(false)} // Close modal when needed
        handleSignUp={handleSignUp} // Pass the sign-up handler
        initialEmail={enteredEmail} // Pre-fill email in the modal
      />
    </>
  );
};

export default GetStartedSection;
