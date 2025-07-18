import React, { useState, useEffect, useContext } from "react";
import { useFormData } from "./FormDataContext";
import VehicleInfo from "./VehicleInfo";
import SellerInformation from "./SellerInformation";
import ConditionDetails from "./ConditionDetails";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ModalManager = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedPayments, setSavedPayments] = useState([]);
    const { formData, getFormDataForSubmission } = useFormData();
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            console.log("No user found, redirecting to login");
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    const goToNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const goToPreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const fetchPayments = async (vehicleId) => {
        try {
            const response = await axiosInstance.get(`/dealership/payments/${vehicleId}/`);
            setSavedPayments(response.data.payments || []);
            console.log("✅ Fetched payments:", response.data.payments);
        } catch (error) {
            console.error("❌ Error fetching payments:", error.response?.data || error.message);
            setError("Failed to fetch payments. Please try again.");
        }
    };

    const handleFinalSubmit = async () => {
        if (isSubmitting || !user) return;
        setError(null);
        setLoading(true);
        setIsSubmitting(true);

        try {
            console.log("🚀 Submitting vehicle details");
            const formDataToSend = getFormDataForSubmission();
            console.log("FormData payload (vehicle):");
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value instanceof File ? value.name : value);
            }

            const vehicleResponse = await axiosInstance.post(`/dealership/vehicle/`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Vehicle created:", vehicleResponse.data);
            const vehicleId = vehicleResponse.data.vehicle_id;

            if (!vehicleId) throw new Error("🚨 Vehicle ID missing in response");

            // Upload images if any
            const images = formData.conditionInfo?.vehicle_images || [];
            if (images.length > 0) {
                console.log("📤 Submitting vehicle images...");
                const imageFormData = new FormData();
                images.forEach((image) => {
                    if (image instanceof File) {
                        imageFormData.append("images", image);
                    }
                });

                console.log("🔹 Sending Images:", Array.from(imageFormData.entries()).map(([key, value]) => `${key}: ${value.name}`));
                const imageResponse = await axiosInstance.post(`/dealership/vehicles/${vehicleId}/images/`, imageFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("✅ Images uploaded:", imageResponse.data);
            } else {
                console.log("ℹ️ No images provided.");
            }

            // Handle payment slots
            const paymentSlots = formData.purchaseInfo?.payment_slot || [];
            if (paymentSlots.length > 0) {
                console.log("📤 Submitting payment slots...");
                const payload = {
                    vehicle_id: vehicleId,
                    payment_slots: paymentSlots.map((slot, index) => ({
                        slot_number: slot.slot_number || `Slot ${index + 1}`,
                        amount_paid: parseFloat(slot.amount_paid) || 0,
                        date_of_payment: slot.date_of_payment || null,
                        payment_mode: slot.payment_mode || null,
                        payment_remark: slot.payment_remark || "",
                        payment_type: "purchase",
                    })),
                };

                console.log("🔹 Sending Payment Slots:", payload);
                const paymentResponse = await axiosInstance.post("/dealership/payments/", payload);
                console.log("✅ Payment slots added:", paymentResponse.data);

                if (paymentResponse.data.errors) {
                    throw new Error(
                        `Some payment slots failed: ${JSON.stringify(paymentResponse.data.errors)}`
                    );
                }

                await fetchPayments(vehicleId);
            } else {
                console.log("ℹ️ No payment slots provided.");
            }

            alert("✅ Vehicle, images, and payment details saved successfully!");
            onClose();
        } catch (error) {
            console.error("❌ Submission error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log("Session expired, redirecting to login");
                localStorage.removeItem("session_id");
                localStorage.removeItem("user");
                navigate("/login");
            }
            const errorMessage = error.response?.data
                ? Object.entries(error.response.data)
                      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                      .join("; ")
                : error.message;
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    const preventModalClose = (e) => e.stopPropagation();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <VehicleInfo onNext={goToNextStep} onBack={goToPreviousStep} onClose={onClose} />;
            case 2:
                return <SellerInformation onNext={goToNextStep} onBack={goToPreviousStep} onClose={onClose} />;
            case 3:
                return (
                    <ConditionDetails
                        onNext={handleFinalSubmit}
                        onBack={goToPreviousStep}
                        onClose={onClose}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return <VehicleInfo />;
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50"
            onClick={preventModalClose}
        >
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl md:max-w-6xl lg:max-w-5xl h-auto p-4 flex flex-col overflow-hidden">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {savedPayments.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-md font-semibold">Saved Payments</h3>
                        <ul className="text-sm">
                            {savedPayments.map((payment, index) => (
                                <li key={index}>
                                    {payment.slot_number}: ₹{payment.amount_paid} ({payment.payment_mode}) on {payment.date_of_payment}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {renderStep()}
            </div>
        </div>
    );
};

export default ModalManager;