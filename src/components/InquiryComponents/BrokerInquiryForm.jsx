import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const BrokerInquiryForm = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        company: "",
        name: "",
        contact: "",
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
            await axiosInstance.post("/dealership/inquiry-brokers/", formData);
            alert("Broker Inquiry Submitted Successfully!");
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
      <h2 className="text-xl font-semibold text-center">Broker Inquiry</h2>

      <input
        type="text"
        name="company"
        placeholder="Company Name"
        value={formData.company}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        name="name"
        placeholder="Broker Name"
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

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default BrokerInquiryForm;
