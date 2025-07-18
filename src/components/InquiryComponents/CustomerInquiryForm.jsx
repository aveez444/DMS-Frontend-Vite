import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const CustomerInquiryForm = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        Vehicle_name: "",
        budget: "",
        model: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.post("/dealership/vehicle-inquiries/", formData);
            alert("Customer Inquiry Submitted Successfully!");
            closeModal();
        } catch (error) {
            console.error("Error submitting inquiry:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
            }
            setError("Failed to submit inquiry.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Customer Inquiry</h2>

      <input
        type="text"
        name="name"
        placeholder="Customer Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={formData.contact}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="Vehicle_name"
        placeholder="Vehicle Name"
        value={formData.Vehicle_name}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        name="budget"
        placeholder="Budget"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        name="model"
        placeholder="Model Year"
        value={formData.model}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CustomerInquiryForm;
