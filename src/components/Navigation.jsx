import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

const Navigation = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      // await loginAPI(email, password);
      // Handle successful login
      setShowLoginModal(false); // Close the modal after successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      // await signUpAPI(name, email, password);
      // Handle successful signup
      setShowSignUpModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isActiveSection = (section) => {
    return location.hash === `#${section}` ? 'text-blue-500' : 'text-gray-700';
  };

  const handleNavigation = async (e, target) => {
    e.preventDefault();
    setIsNavigating(true);

    // Save scroll position
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());

    try {
      if (location.pathname !== '/') {
        await navigate('/'); // Navigate to the root path
        // Restore scroll position after navigation
        setTimeout(() => {
          const savedPosition = sessionStorage.getItem('scrollPosition');
          if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
          }
          const section = document.querySelector(target);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const renderLinks = () => {
    const links = [
      { href: '#home', text: 'Home' },
      { href: '#about', text: 'About' },
      { href: '#features', text: 'Features' },
      { href: '#faq', text: 'FAQ' }
    ];

    return links.map(({ href, text }) => (
      <li key={href}>
        <a
          href={href}
          onClick={(e) => handleNavigation(e, href)}
          className={`cursor-pointer hover:text-blue-500 transition-colors duration-200 ${isActiveSection(
            href.slice(1)
          )}`}
          aria-current={location.hash === href ? 'page' : undefined}
        >
          {text}
        </a>
      </li>
    ));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 font-sans">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Mobile Hamburger and Logo */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden flex items-center text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <Link to="/" className="text-2xl font-bold text-black hover:opacity-80 transition-opacity">
            DMS
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6 ml-auto text-lg">
          {renderLinks()}
        </ul>

        {/* Buttons for Login and Sign Up */}
        <div className="flex space-x-4 ml-6">
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 border border-black rounded-md text-gray-700 hover:bg-gray-100 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
          <button
            onClick={() => setShowSignUpModal(true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sign Up'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          {renderLinks()}
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Loading Indicator for Navigation */}
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Login
          showModal={showLoginModal}
          closeModal={() => setShowLoginModal(false)}
        />
      )}

      {/* Sign Up Modal */}
      <SignUp
        showModal={showSignUpModal}
        closeModal={() => setShowSignUpModal(false)}
        handleSignUp={handleSignUp}
        isLoading={isLoading}
        error={error}
      />
    </nav>
  );
};

export default Navigation;