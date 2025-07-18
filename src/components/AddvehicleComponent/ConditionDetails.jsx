import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useFormData } from "./FormDataContext";

const ConditionDetails = ({ onNext, onBack, onClose, isSubmitting }) => {
    const { formData, updateFormData } = useFormData();

    const [conditionData, setConditionData] = useState({
        inspection_date: formData.conditionInfo?.inspection_date || "",
        condition_grade: formData.conditionInfo?.condition_grade || "",
        damage_details_if_any: formData.conditionInfo?.damage_details_if_any || "",
        tires_condition: formData.conditionInfo?.tires_condition || "",
        engine_condition: formData.conditionInfo?.engine_condition || "",
        interior_condition: formData.conditionInfo?.interior_condition || "",
    });

    const [vehicleImages, setVehicleImages] = useState(formData.conditionInfo?.vehicle_images || []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConditionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files).filter(file => file instanceof File);
        if (files.length > 0) {
            const newImages = [...vehicleImages, ...files].slice(0, 5);
            console.log("Uploaded images:", newImages);
            setVehicleImages(newImages);
            updateFormData("conditionInfo", { ...conditionData, vehicle_images: newImages });
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = vehicleImages.filter((_, i) => i !== index);
        setVehicleImages(newImages);
        updateFormData("conditionInfo", { ...conditionData, vehicle_images: newImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Submitting conditionData:", conditionData);
        console.log("Submitting vehicleImages:", vehicleImages);

        if (!conditionData.inspection_date || !conditionData.condition_grade) {
            alert("Please fill all required fields in Condition Details.");
            return;
        }

        if (vehicleImages.length === 0) {
            alert("Please upload at least one image of the vehicle.");
            return;
        }

        updateFormData("conditionInfo", {
            ...conditionData,
            vehicle_images: vehicleImages,
        });

        onNext();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl md:max-w-6xl lg:max-w-5xl h-auto max-h-screen p-6 flex flex-col md:flex-row overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    <IoClose />
                </button>

                <aside className="hidden md:flex md:w-[25%] bg-gray-50 border-r p-4 flex-col">
                    <h2 className="text-lg font-semibold mb-3">Add Vehicle</h2>
                    <ul className="text-sm">
                        {["Vehicle Info", "Seller Info", "Condition Info"].map((step, index) => (
                            <li
                                key={index}
                                className={`py-2 px-3 mb-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-200 transition ${
                                    step === "Condition Info" ? "bg-blue-100 text-blue-600" : ""
                                }`}
                            >
                                {step}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="w-full md:w-[75%] p-4 flex flex-col">
                    <h2 className="text-xl font-semibold text-center md:text-left mb-4">Condition & Inspection Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-sm">
                        {[
                            { label: "Inspection Date", name: "inspection_date", type: "date" },
                            { label: "Damage Details (if any)", name: "damage_details_if_any", type: "text" },
                            { label: "Engine Condition", name: "engine_condition", type: "text" },
                        ].map(({ label, name, type }) => (
                            <div key={name} className="flex flex-col">
                                <label className="text-gray-700 font-medium">{label}</label>
                                <input
                                    type={type || "text"}
                                    name={name}
                                    value={conditionData[name]}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 h-10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder={`Enter ${label}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
                        {[
                            {
                                label: "Condition Grade",
                                name: "condition_grade",
                                options: ["Excellent", "Good", "Fair", "Poor"],
                            },
                            {
                                label: "Tires Condition",
                                name: "tires_condition",
                                options: ["0-25", "25-50", "50-75", "75-100"],
                            },
                            {
                                label: "Interior Condition",
                                name: "interior_condition",
                                options: ["Excellent", "Good", "Fair", "Poor"],
                            },
                        ].map(({ label, name, options }) => (
                            <div key={name} className="flex flex-col">
                                <label className="text-gray-700 font-medium">{label}</label>
                                <select
                                    name={name}
                                    value={conditionData[name]}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 h-10 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                >
                                    <option value="">Select {label}</option>
                                    {options.map((opt, idx) => (
                                        <option key={idx} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col border p-4 rounded bg-gray-50">
                        <label className="text-gray-700 font-medium mb-2">Upload Image(s) of Vehicle (Max 5)</label>
                        <div className="border p-3 rounded bg-white flex flex-col items-center">
                            <label
                                htmlFor="uploadImage"
                                className="cursor-pointer flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                            >
                                <FaPlus />
                                <span>Upload Images</span>
                            </label>
                            <input
                                id="uploadImage"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            {vehicleImages.length > 0 && (
                                <div className="mt-4 w-full">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {vehicleImages.map((image, index) => (
                                            <div key={index} className="relative bg-gray-100 p-2 rounded">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Vehicle Image ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                                <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t bg-white mt-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onBack();
                                }}
                                className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm font-medium"
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConditionDetails;