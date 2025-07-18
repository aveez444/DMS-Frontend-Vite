import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUserWizard = ({ isOpen, onClose, onUserAdded }) => {
  const [roleName, setRoleName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset fields when modal is closed
      setRoleName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Construct final payload
    const payload = {
      role: roleName.trim(),
      username: userName.trim(),
      email: email.trim(),
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      const token = localStorage.getItem("token"); // or from context

      const response = await fetch("http://127.0.0.1:8000/create-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      

      if (!response.ok) {
        // If server returns errors, parse them
        const errorData = await response.json();
        console.error("Create user error:", errorData);
        alert(`Failed to create user: ${JSON.stringify(errorData)}`);
        return;
      }

      // Success
      const createdUser = await response.json();
      console.log("User created successfully:", createdUser);

      // Optionally call parent callback
      if (onUserAdded) {
        onUserAdded(createdUser);
      }
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const isFormValid = () => {
    return (
      roleName.trim() !== "" &&
      userName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={24} />
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Create New User</h1>

        <label className="block text-gray-700 mb-2">Role Name</label>
        <input
          type="text"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-gray-700 mb-2">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-gray-700 mb-2">Email/Login ID</label>
        <input
          type="email"
          placeholder="Enter email or login ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-gray-700 mb-2">Password</label>
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label className="block text-gray-700 mb-2">Confirm Password</label>
        <div className="relative w-full mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          onClick={handleFinish}
          disabled={!isFormValid()}
          className={`w-full px-4 py-2 rounded-md text-white ${
            isFormValid()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } transition`}
        >
          Create User
        </button>
      </div>
    </div>
  );
};

export default AddUserWizard;
