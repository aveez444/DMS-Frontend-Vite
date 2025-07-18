import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import HeroSection from "../components/LandingPageComponents/HeroSection";
import ScrollingTextSection from "../components/LandingPageComponents/ScrollingTextSection";
import AboutSection from "../components/LandingPageComponents/AboutSection";
import FeaturesSection from "../components/LandingPageComponents/FeaturesSection";
import GetStartedSection from "../components/LandingPageComponents/GetStartedSection";
import FAQSection from "../components/LandingPageComponents/FAQSection";
import Footer from "../components/LandingPageComponents/Footer";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState(""); // State for the entered email

  // Handle Sign Up logic
  const handleSignUp = (name, email, password) => {
    console.log("User signed up with:", { name, email, password });
    // Add your sign-up API call or logic here
  };

  // Dynamic text content for ScrollingTextSection
  const sections = [
    {
      id: 1,
      title: "We get it...",
      lines: [
        "Running a car dealership is a lot to juggle, and pen-and-paper methods only slow you down.",
      ],
    },
    {
      id: 2,
      title: "Make it Simple",
      lines: [
        "Our Dealer Management System (DMS) makes it simple.",
        "Quickly find car details, calculate prices, send invoices,",
        "and share catalogs with just a few clicks.",
        "Say goodbye to busywork and focus on what you do best: selling vehicles.",
      ],
      button: true, // Indicate the section with a button
    },
  ];

  // Handle navigation to the demo page
  const handleDemoNavigation = () => {
    navigate("/demo"); // Navigate to the demo page
  };

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ScrollingTextSection
        sections={sections}
        handleDemoNavigation={handleDemoNavigation}
      />
      <AboutSection />
      <FeaturesSection />
      <GetStartedSection
        enteredEmail={enteredEmail}
        setEnteredEmail={setEnteredEmail}
        setShowSignUpModal={setShowSignUpModal}
      />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
