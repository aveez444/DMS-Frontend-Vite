import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PaymentDetailsCollapse = ({ vehicle_id }) => {
    const [paymentSlots, setPaymentSlots] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // Fetch payment slots
    const fetchPaymentSlots = async () => {
        if (!user || !vehicle_id) return;
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching payment slots for vehicle_id:", vehicle_id);
            const response = await axiosInstance.get(`/dealership/payments/${vehicle_id}/`);
            console.log("Raw payment slots response:", response.data);
            // Handle paginated response from ViewPaymentsAPIView
            let payments;
            if (response.data.results && response.data.results.payments) {
                payments = response.data.results.payments;
            } else if (Array.isArray(response.data)) {
                payments = response.data; // Fallback for non-paginated array response
            } else {
                payments = [];
            }
            setPaymentSlots(Array.isArray(payments) ? payments : []);
            console.log("Parsed payment slots:", payments);
        } catch (error) {
            console.error("Error fetching payment slots:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                navigate("/login");
            }
            setError("Failed to load payment slots. Please try again.");
            setPaymentSlots([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentSlots();
    }, [vehicle_id, user, navigate]);

  
    return (
        <div className="mt-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left text-xl font-semibold py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
          >
            {expanded ? "Hide Payment Slots" : "View Payment Slots"}
          </button>
    
          {expanded && (
            <div className="mt-6 space-y-4">
              {paymentSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300"
                >
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold">Slot {slot.slot_number}:</span> ₹
                    {slot.amount_paid}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(slot.date_of_payment).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Type:</span> {slot.payment_type}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Remark:</span>{" "}
                    {slot.payment_remark || "No remark"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    
    export default PaymentDetailsCollapse;