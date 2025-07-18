import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../DashboardComponents/Sidebar";

const UpdateDetails = () => {
    const { vehicle_id } = useParams();
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const [originalInboundData, setOriginalInboundData] = useState({});
    const [activeForm, setActiveForm] = useState("inbound");
    const [inboundData, setInboundData] = useState({
        vehicle_type: "car",
        vehicle_make: "",
        vehicle_model: "",
        year_of_manufacturing: "",
        year_of_registration: "",
        chassis_number: "",
        engine_number: "",
        osn_number: "",
        license_plate_number: "",
        odometer_reading_kms: "",
        color: "",
        fuel_type: "",
        transmission_type: "",
        seller_name_company_name: "",
        mobile_number: "",
        email_address: "",
        inspection_date: "",
        condition_grade: "",
        tires_condition: "",
        damage_details_if_any: "",
        engine_condition: "",
        interior_condition: "",
        purchase_price: "",
        date_of_purchase: "",
        payment_method: "",
        arrival_date: "",
        storage_location: "",
        notes: "",
        estimated_selling_price: ""
    });

    const [outboundData, setOutboundData] = useState({
        buyers_name: "",
        buyers_contact_details: "",
        buyers_address: "",
        selling_price: "",
        outbound_date: "",
        estimated_delivery_date: "",
        delivery_status: "Pending",
        vehicle_current_condition: "Good",
        other_expense: "",
        notes: ""
    });

    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({
        slot_number: "Slot 1",
        amount_paid: "",
        date_of_payment: "",
        payment_mode: "",
        payment_remark: "",
        payment_type: "purchase"
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768;
            setIsMobile(newIsMobile);
            if (!newIsMobile) {
                setIsSidebarExpanded(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            console.log("No user found, redirecting to login");
            localStorage.clear();
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    const handleUnauthorized = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Fetch all vehicle details
    const fetchVehicleDetails = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            
            // Fetch inbound data
            const response = await axiosInstance.get(`/dealership/vehicle-detail/${vehicle_id}/`);
            setInboundData({
                vehicle_type: response.data.vehicle_type || "car",
                vehicle_make: response.data.vehicle_make || "",
                vehicle_model: response.data.vehicle_model || "",
                year_of_manufacturing: response.data.year_of_manufacturing || "",
                year_of_registration: response.data.year_of_registration || "",
                chassis_number: response.data.chassis_number || "",
                engine_number: response.data.engine_number || "",
                osn_number: response.data.osn_number || "",
                license_plate_number: response.data.license_plate_number || "",
                odometer_reading_kms: response.data.odometer_reading_kms || "",
                color: response.data.color || "",
                fuel_type: response.data.fuel_type || "",
                transmission_type: response.data.transmission_type || "",
                seller_name_company_name: response.data.seller_name_company_name || "",
                mobile_number: response.data.mobile_number || "",
                email_address: response.data.email_address || "",
                inspection_date: response.data.inspection_date || "",
                condition_grade: response.data.condition_grade || "",
                tires_condition: response.data.tires_condition || "",
                damage_details_if_any: response.data.damage_details_if_any || "",
                engine_condition: response.data.engine_condition || "",
                interior_condition: response.data.interior_condition || "",
                purchase_price: response.data.purchase_price || "",
                date_of_purchase: response.data.date_of_purchase || "",
                payment_method: response.data.payment_method || "",
                arrival_date: response.data.arrival_date || "",
                storage_location: response.data.storage_location || "",
                notes: response.data.notes || "",
                estimated_selling_price: response.data.estimated_selling_price || ""
            });

            setOriginalInboundData({
                vehicle_type: response.data.vehicle_type || "car",
                vehicle_make: response.data.vehicle_make || "",
                vehicle_model: response.data.vehicle_model || "",
                year_of_manufacturing: response.data.year_of_manufacturing || "",
                year_of_registration: response.data.year_of_registration || "",
                chassis_number: response.data.chassis_number || "",
                engine_number: response.data.engine_number || "",
                osn_number: response.data.osn_number || "",
                license_plate_number: response.data.license_plate_number || "",
                odometer_reading_kms: response.data.odometer_reading_kms || "",
                color: response.data.color || "",
                fuel_type: response.data.fuel_type || "",
                transmission_type: response.data.transmission_type || "",
                seller_name_company_name: response.data.seller_name_company_name || "",
                mobile_number: response.data.mobile_number || "",
                email_address: response.data.email_address || "",
                inspection_date: response.data.inspection_date || "",
                condition_grade: response.data.condition_grade || "",
                tires_condition: response.data.tires_condition || "",
                damage_details_if_any: response.data.damage_details_if_any || "",
                engine_condition: response.data.engine_condition || "",
                interior_condition: response.data.interior_condition || "",
                purchase_price: response.data.purchase_price || "",
                date_of_purchase: response.data.date_of_purchase || "",
                payment_method: response.data.payment_method || "",
                arrival_date: response.data.arrival_date || "",
                storage_location: response.data.storage_location || "",
                notes: response.data.notes || "",
                estimated_selling_price: response.data.estimated_selling_price || ""
            });

            // Fetch outbound data if exists
            try {
                const outboundResponse = await axiosInstance.get(`/dealership/outbound-vehicle/${vehicle_id}/`);
                setOutboundData({
                    buyers_name: outboundResponse.data.buyers_name || "",
                    buyers_contact_details: outboundResponse.data.buyers_contact_details || "",
                    buyers_address: outboundResponse.data.buyers_address || "",
                    selling_price: outboundResponse.data.selling_price || "",
                    outbound_date: outboundResponse.data.outbound_date || "",
                    estimated_delivery_date: outboundResponse.data.estimated_delivery_date || "",
                    delivery_status: outboundResponse.data.delivery_status || "Pending",
                    vehicle_current_condition: outboundResponse.data.vehicle_current_condition || "Good",
                    other_expense: outboundResponse.data.other_expense || "",
                    notes: outboundResponse.data.notes || ""
                });
            } catch (outboundError) {
                console.log("No outbound data available yet");
            }

            // Fetch payments data
            try {
                const paymentsResponse = await axiosInstance.get(`/dealership/payments/${vehicle_id}/`);
                setPayments(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []);

            } catch (paymentsError) {
                console.log("No payments data available yet");
            }

        } catch (error) {
            console.error("Error fetching vehicle details:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleUnauthorized();
            }
            setError("Failed to load vehicle details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVehicleDetails();
        }
    }, [vehicle_id, user]);

    const handleInboundSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            handleUnauthorized();
            return;
        }
    
        try {
            setError(null);
            const formData = new FormData();
    
            const nullableFields = [
                'engine_number', 
                'osn_number', 
                'email_address',
                'year_of_registration',
                'inspection_date',
                'damage_details_if_any',
                'engine_condition',
                'interior_condition',
                'purchase_price',
                'date_of_purchase',
                'payment_method',
                'arrival_date',
                'storage_location',
                'notes',
                'estimated_selling_price'
            ];
    
            for (const [key, newValue] of Object.entries(inboundData)) {
                const oldValue = originalInboundData[key];
    
                // Treat null/empty string equivalently
                const normalize = val => (val === undefined || val === null) ? "" : val.toString();
    
                if (normalize(newValue) !== normalize(oldValue)) {
                    if (
                        ['proof_of_ownership_document', 'upload_image_of_vehicle', 
                        'proof_of_ownership', 'purchase_agreement'].includes(key) &&
                        (newValue === null || newValue === "")
                    ) {
                        continue; // skip empty file fields
                    }
    
                    if (newValue === "" && nullableFields.includes(key)) {
                        formData.append(key, "null");
                    } else {
                        formData.append(key, newValue);
                    }
                }
            }
    
            if ([...formData.keys()].length === 0) {
                alert("No changes made.");
                return;
            }
    
            console.log("Submitting changed fields:", Object.fromEntries(formData));
    
            const response = await axiosInstance.patch(
                `/dealership/vehicle/update/${vehicle_id}/`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            alert("Inbound details updated successfully!");
            navigate(`/dashboard/${user.uuid}/updates-management/`);
        } catch (error) {
            console.error("Error updating inbound details:", error);
            console.error("Error response:", error.response?.data);
    
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleUnauthorized();
            }
    
            const errorMessage = 
                error.response?.data?.message ||
                (typeof error.response?.data === 'object'
                    ? Object.entries(error.response.data)
                        .map(([key, errors]) => `${key}: ${errors.join(', ')}`)
                        .join('; ')
                    : "Failed to update inbound details. Please try again.");
    
            setError(errorMessage);
        }
    };

    // Handle outbound form submit
    const handleOutboundSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            handleUnauthorized();
            return;
        }
        try {
            setError(null);
            const response = await axiosInstance.patch(
                `/dealership/outbound/update/${vehicle_id}/`, 
                outboundData
            );
            alert("Outbound details updated successfully!");
            navigate(`/dashboard/${user.uuid}/updates-management/`);
        } catch (error) {
            console.error("Error updating outbound details:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleUnauthorized();
            }
            setError(error.response?.data?.message || "Failed to update outbound details. Please try again.");
        }
    };

   const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return handleUnauthorized();

    try {
        setPaymentError(null);
        const isEdit = payments.some(p =>
            p.slot_number === newPayment.slot_number && p.payment_type === newPayment.payment_type
        );

        const endpoint = `/dealership/payments/${vehicle_id}/${newPayment.slot_number}/`;
        const method = isEdit ? axiosInstance.put : axiosInstance.post;

        const payload = {
            ...newPayment,
            vehicle_id: vehicle_id,
        };

        const response = await method(isEdit ? endpoint : '/dealership/payments/', isEdit ? payload : {
            vehicle_id: vehicle_id,
            payment_slots: [newPayment]
        });

        if (isEdit) {
            const updated = response.data.updated_data;
            setPayments(prev =>
                prev.map(p =>
                    p.slot_number === updated.slot_number && p.payment_type === updated.payment_type
                        ? updated
                        : p
                )
            );
        } else {
            setPayments(prev => [...prev, ...response.data.data]);
        }

        setNewPayment({
            slot_number: "Slot 1",
            amount_paid: "",
            date_of_payment: "",
            payment_mode: "",
            payment_remark: "",
            payment_type: "purchase"
        });

        setPaymentSuccess(isEdit ? "Payment updated!" : "Payment added!");
        setTimeout(() => setPaymentSuccess(null), 3000);
    } catch (error) {
        console.error("Payment error:", error);
        setPaymentError("Payment failed. Try again.");
    }
};

    
    // Handle payment update
    const handlePaymentUpdate = async (paymentId, updatedData) => {
        if (!user) {
            handleUnauthorized();
            return;
        }
        try {
            setPaymentError(null);
            const response = await axiosInstance.put(
                `/dealership/payments/${vehicle_id}/${updatedData.slot_number}/`,
                updatedData
            );
            setPayments(payments.map(p => 
                p.id === paymentId ? response.data : p
            ));
            setPaymentSuccess("Payment updated successfully!");
            setTimeout(() => setPaymentSuccess(null), 3000);
        } catch (error) {
            console.error("Error updating payment:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleUnauthorized();
            }
            setPaymentError(error.response?.data?.message || "Failed to update payment. Please try again.");
        }
    };

    // Handle payment delete
    const handlePaymentDelete = async (paymentId, slotNumber) => {
        if (!user) {
            handleUnauthorized();
            return;
        }
        if (!window.confirm("Are you sure you want to delete this payment?")) return;
        try {
            setPaymentError(null);
            await axiosInstance.delete(
                `/dealership/payments/${vehicle_id}/${slotNumber}/`
            );
            setPayments(payments.filter(p => p.id !== paymentId));
            setPaymentSuccess("Payment deleted successfully!");
            setTimeout(() => setPaymentSuccess(null), 3000);
        } catch (error) {
            console.error("Error deleting payment:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleUnauthorized();
            }
            setPaymentError(error.response?.data?.message || "Failed to delete payment. Please try again.");
        }
    };
    
         if (authLoading || loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                />
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-0"
                    }`}
                >
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading vehicle details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

     if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                />
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isMobile ? "" : isSidebarExpanded ? "ml-64" : "ml-16"
                    }`}
                >
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Data Loading Error</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    
        return (
            <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-[1000] bg-white text-gray-700 hover:text-blue-500 p-2 rounded-full shadow-md focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <HiMenu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 p-4 md:p-6 ${
                    isMobile ? "ml-0" : isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
            >
            </div>
            <div className="container mx-auto p-4">
                <div className="flex space-x-4 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveForm("inbound")}
                        className={`px-4 py-2 rounded-md ${
                            activeForm === "inbound"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        Update Inbound
                    </button>
                    <button
                        onClick={() => setActiveForm("outbound")}
                        className={`px-4 py-2 rounded-md ${
                            activeForm === "outbound"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        Update Outbound
                    </button>
                    <button
                        onClick={() => setActiveForm("payments")}
                        className={`px-4 py-2 rounded-md ${
                            activeForm === "payments"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        Manage Payments
                    </button>
                </div>
    
                {activeForm === "inbound" && (
                    <form onSubmit={handleInboundSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Update Inbound Vehicle</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vehicle Information */}
                            <div className="col-span-2 border-b pb-2 mb-2">
                                <h3 className="text-lg font-medium">Vehicle Information</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                                <select
                                    name="vehicle_type"
                                    value={inboundData.vehicle_type}
                                    onChange={(e) => setInboundData({...inboundData, vehicle_type: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="car">Car</option>
                                    <option value="bus">Bus</option>
                                    <option value="truck">Truck</option>
                                    <option value="three_wheelers">Three Wheelers</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
                                <input
                                    type="text"
                                    name="vehicle_make"
                                    value={inboundData.vehicle_make}
                                    onChange={(e) => setInboundData({...inboundData, vehicle_make: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                                <input
                                    type="text"
                                    name="vehicle_model"
                                    value={inboundData.vehicle_model}
                                    onChange={(e) => setInboundData({...inboundData, vehicle_model: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year of Manufacturing</label>
                                <input
                                    type="number"
                                    name="year_of_manufacturing"
                                    value={inboundData.year_of_manufacturing}
                                    onChange={(e) => setInboundData({...inboundData, year_of_manufacturing: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year of Registration</label>
                                <input
                                    type="number"
                                    name="year_of_registration"
                                    value={inboundData.year_of_registration}
                                    onChange={(e) => setInboundData({...inboundData, year_of_registration: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chassis Number (VIN)</label>
                                <input
                                    type="text"
                                    name="chassis_number"
                                    value={inboundData.chassis_number}
                                    onChange={(e) => setInboundData({...inboundData, chassis_number: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Engine Number</label>
                                <input
                                    type="text"
                                    name="engine_number"
                                    value={inboundData.engine_number}
                                    onChange={(e) => setInboundData({...inboundData, engine_number: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OSN Number</label>
                                <input
                                    type="text"
                                    name="osn_number"
                                    value={inboundData.osn_number}
                                    onChange={(e) => setInboundData({...inboundData, osn_number: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">License Plate Number</label>
                                <input
                                    type="text"
                                    name="license_plate_number"
                                    value={inboundData.license_plate_number}
                                    onChange={(e) => setInboundData({...inboundData, license_plate_number: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Odometer Reading (kms)</label>
                                <input
                                    type="number"
                                    name="odometer_reading_kms"
                                    value={inboundData.odometer_reading_kms}
                                    onChange={(e) => setInboundData({...inboundData, odometer_reading_kms: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={inboundData.color}
                                    onChange={(e) => setInboundData({...inboundData, color: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                <input
                                    type="text"
                                    name="fuel_type"
                                    value={inboundData.fuel_type}
                                    onChange={(e) => setInboundData({...inboundData, fuel_type: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transmission Type</label>
                                <input
                                    type="text"
                                    name="transmission_type"
                                    value={inboundData.transmission_type}
                                    onChange={(e) => setInboundData({...inboundData, transmission_type: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>
                                                {/* Seller Information */}
                                                <div className="col-span-2 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-lg font-medium">Seller Information</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Seller Name/Company</label>
                            <input
                                type="text"
                                name="seller_name_company_name"
                                value={inboundData.seller_name_company_name}
                                onChange={(e) => setInboundData({...inboundData, seller_name_company_name: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                value={inboundData.mobile_number}
                                onChange={(e) => setInboundData({...inboundData, mobile_number: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email_address"
                                value={inboundData.email_address}
                                onChange={(e) => setInboundData({...inboundData, email_address: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Condition and Inspection */}
                        <div className="col-span-2 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-lg font-medium">Condition and Inspection</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Inspection Date</label>
                            <input
                                type="date"
                                name="inspection_date"
                                value={inboundData.inspection_date}
                                onChange={(e) => setInboundData({...inboundData, inspection_date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Condition Grade</label>
                            <select
                                name="condition_grade"
                                value={inboundData.condition_grade}
                                onChange={(e) => setInboundData({...inboundData, condition_grade: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Select Grade</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tires Condition</label>
                            <select
                                name="tires_condition"
                                value={inboundData.tires_condition}
                                onChange={(e) => setInboundData({...inboundData, tires_condition: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Select Condition</option>
                                <option value="0-25">0-25%</option>
                                <option value="25-50">25-50%</option>
                                <option value="50-75">50-75%</option>
                                <option value="75-100">75-100%</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Damage Details (if any)</label>
                            <input
                                type="text"
                                name="damage_details_if_any"
                                value={inboundData.damage_details_if_any}
                                onChange={(e) => setInboundData({...inboundData, damage_details_if_any: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Engine Condition</label>
                            <input
                                type="text"
                                name="engine_condition"
                                value={inboundData.engine_condition}
                                onChange={(e) => setInboundData({...inboundData, engine_condition: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interior Condition</label>
                            <select
                                name="interior_condition"
                                value={inboundData.interior_condition}
                                onChange={(e) => setInboundData({...inboundData, interior_condition: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Select Condition</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>

                        {/* Purchase Information */}
                        <div className="col-span-2 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-lg font-medium">Purchase Information</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                            <input
                                type="number"
                                name="purchase_price"
                                value={inboundData.purchase_price}
                                onChange={(e) => setInboundData({...inboundData, purchase_price: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Purchase</label>
                            <input
                                type="date"
                                name="date_of_purchase"
                                value={inboundData.date_of_purchase}
                                onChange={(e) => setInboundData({...inboundData, date_of_purchase: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <input
                                type="text"
                                name="payment_method"
                                value={inboundData.payment_method}
                                onChange={(e) => setInboundData({...inboundData, payment_method: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
                            <input
                                type="date"
                                name="arrival_date"
                                value={inboundData.arrival_date}
                                onChange={(e) => setInboundData({...inboundData, arrival_date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Storage Location</label>
                            <input
                                type="text"
                                name="storage_location"
                                value={inboundData.storage_location}
                                onChange={(e) => setInboundData({...inboundData, storage_location: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={inboundData.notes}
                                onChange={(e) => setInboundData({...inboundData, notes: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estimated Selling Price</label>
                            <input
                                type="number"
                                name="estimated_selling_price"
                                value={inboundData.estimated_selling_price}
                                onChange={(e) => setInboundData({...inboundData, estimated_selling_price: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Update Inbound Details
                            </button>
                        </div>
                
                </form>
            )}

            {activeForm === "outbound" && (
                <form onSubmit={handleOutboundSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">Update Outbound Vehicle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Buyer Information */}
                        <div className="col-span-2 border-b pb-2 mb-2">
                            <h3 className="text-lg font-medium">Buyer Information</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Buyer's Name</label>
                            <input
                                type="text"
                                name="buyers_name"
                                value={outboundData.buyers_name}
                                onChange={(e) => setOutboundData({...outboundData, buyers_name: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                            <input
                                type="text"
                                name="buyers_contact_details"
                                value={outboundData.buyers_contact_details}
                                onChange={(e) => setOutboundData({...outboundData, buyers_contact_details: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                name="buyers_address"
                                value={outboundData.buyers_address}
                                onChange={(e) => setOutboundData({...outboundData, buyers_address: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                rows="2"
                            />
                        </div>

                        {/* Sale Information */}
                        <div className="col-span-2 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-lg font-medium">Sale Information</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                            <input
                                type="number"
                                name="selling_price"
                                value={outboundData.selling_price}
                                onChange={(e) => setOutboundData({...outboundData, selling_price: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Other Expenses</label>
                            <input
                                type="number"
                                name="other_expense"
                                value={outboundData.other_expense}
                                onChange={(e) => setOutboundData({...outboundData, other_expense: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Outbound Date</label>
                            <input
                                type="date"
                                name="outbound_date"
                                value={outboundData.outbound_date}
                                onChange={(e) => setOutboundData({...outboundData, outbound_date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estimated Delivery Date</label>
                            <input
                                type="date"
                                name="estimated_delivery_date"
                                value={outboundData.estimated_delivery_date}
                                onChange={(e) => setOutboundData({...outboundData, estimated_delivery_date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Delivery Status</label>
                            <select
                                name="delivery_status"
                                value={outboundData.delivery_status}
                                onChange={(e) => setOutboundData({...outboundData, delivery_status: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vehicle Current Condition</label>
                            <select
                                name="vehicle_current_condition"
                                value={outboundData.vehicle_current_condition}
                                onChange={(e) => setOutboundData({...outboundData, vehicle_current_condition: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Bad">Bad</option>
                                <option value="Worse">Worse</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={outboundData.notes}
                                onChange={(e) => setOutboundData({...outboundData, notes: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                rows="3"
                            />
                        </div>

                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Update Outbound Details
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {activeForm === "payments" && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">Manage Payments</h2>
                    
                    {/* Payment Success/Error Messages */}
                    {paymentSuccess && (
                        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                            {paymentSuccess}
                        </div>
                    )}
                    {paymentError && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                            {paymentError}
                        </div>
                    )}

                    {/* Existing Payments Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-2">Existing Payments</h3>
                        {payments.length === 0 ? (
                            <p className="text-gray-500">No payments recorded yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="py-2 px-4 border">Slot</th>
                                            <th className="py-2 px-4 border">Type</th>
                                            <th className="py-2 px-4 border">Amount</th>
                                            <th className="py-2 px-4 border">Date</th>
                                            <th className="py-2 px-4 border">Mode</th>
                                            <th className="py-2 px-4 border">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border">{payment.slot_number}</td>
                                                <td className="py-2 px-4 border">
                                                    {payment.payment_type === 'purchase' ? 'Purchase' : 'Selling'}
                                                </td>
                                                <td className="py-2 px-4 border">{payment.amount_paid}</td>
                                                <td className="py-2 px-4 border">{payment.date_of_payment}</td>
                                                <td className="py-2 px-4 border">{payment.payment_mode}</td>
                                                <td className="py-2 px-4 border">
                                                    <button
                                                        onClick={() => {
                                                            setNewPayment({
                                                                slot_number: payment.slot_number,
                                                                amount_paid: payment.amount_paid,
                                                                date_of_payment: payment.date_of_payment,
                                                                payment_mode: payment.payment_mode,
                                                                payment_remark: payment.payment_remark,
                                                                payment_type: payment.payment_type
                                                            });
                                                            document.getElementById('payment-form').scrollIntoView();
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handlePaymentDelete(payment.id, payment.slot_number)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Payment Form */}
                    <div id="payment-form">
                        <h3 className="text-lg font-medium mb-2">
                            {newPayment.amount_paid ? "Edit Payment" : "Add New Payment"}
                        </h3>
                        <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slot Number</label>
                                <select
                                    name="slot_number"
                                    value={newPayment.slot_number}
                                    onChange={(e) => setNewPayment({...newPayment, slot_number: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    {[...Array(10).keys()].map(i => (
                                        <option key={i} value={`Slot ${i+1}`}>Slot {i+1}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                                <select
                                    name="payment_type"
                                    value={newPayment.payment_type}
                                    onChange={(e) => setNewPayment({...newPayment, payment_type: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="purchase">Purchase Payment</option>
                                    <option value="selling">Selling Payment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                <input
                                    type="number"
                                    name="amount_paid"
                                    value={newPayment.amount_paid}
                                    onChange={(e) => setNewPayment({...newPayment, amount_paid: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Payment</label>
                                <input
                                    type="date"
                                    name="date_of_payment"
                                    value={newPayment.date_of_payment}
                                    onChange={(e) => setNewPayment({...newPayment, date_of_payment: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                                <select
                                    name="payment_mode"
                                    value={newPayment.payment_mode}
                                    onChange={(e) => setNewPayment({...newPayment, payment_mode: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="">Select Mode</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="upi">UPI</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea
                                    name="payment_remark"
                                    value={newPayment.payment_remark}
                                    onChange={(e) => setNewPayment({...newPayment, payment_remark: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    rows="2"
                                />
                            </div>
                            <div className="col-span-2 mt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    {newPayment.amount_paid ? "Update Payment" : "Add Payment"}
                                </button>
                                {newPayment.amount_paid && (
                                    <button
                                        type="button"
                                        onClick={() => setNewPayment({
                                            slot_number: "Slot 1",
                                            amount_paid: "",
                                            date_of_payment: "",
                                            payment_mode: "",
                                            payment_remark: "",
                                            payment_type: "purchase"
                                        })}
                                        className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </div>
        
    );
};

export default UpdateDetails;
