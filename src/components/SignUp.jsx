import React, { useState, useEffect } from "react";

const SignUp = ({ showModal, closeModal, handleSignUp, initialEmail }) => {
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Pre-fill the email field when the modal opens
  useEffect(() => {
    if (initialEmail) {
      setSignUpEmail(initialEmail);
    }
  }, [initialEmail]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    handleSignUp(signUpName, signUpEmail, signUpPassword);
    closeModal();
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-md shadow-md w-96 relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="block w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="block w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="block w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full mb-4 px-4 py-2 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default SignUp;
