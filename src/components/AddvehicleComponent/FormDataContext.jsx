import React, { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    vehicleInfo: {
      vehicle_type: "car",
      vehicle_make: "",
      vehicle_model: "",
      year_of_manufacturing: "",
      year_of_registration: "",
      chassis_number: "",
      engine_number: "",
      osn_number: "",
      license_plate_number: "",
      odometer_reading_kms: 0,
      color: "",
      fuel_type: "",
      transmission_type: "",
    },
    sellerInfo: {
      seller_name_company_name: "",
      mobile_number: "",
      email_address: "",
      proof_of_ownership_document: null,
    },
    purchaseInfo: {
      purchase_price: 0.00,
      date_of_purchase: "",
      payment_slot: [],
      purchase_agreement: null,
    },
    conditionInfo: {
      inspection_date: "",
      condition_grade: "",
      damage_details_if_any: "",
      tires_condition: "",
      engine_condition: "",
      interior_condition: "",
      vehicle_images: [], // Changed from upload_image_of_vehicle
    },
  });

  const updateFormData = (section, newData) => {
    console.log(`Updating ${section}:`, newData);
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newData,
      },
    }));
  };

  const getFormDataForSubmission = () => {
    const formDataToSend = new FormData();

    const appendToFormData = (data, prefix = "") => {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "proof_of_ownership_document" && value instanceof File) {
          formDataToSend.append("proof_of_ownership_document", value);
        } else if (key === "purchase_agreement" && value instanceof File) {
          formDataToSend.append("purchase_agreement", value);
        } else if (key !== "payment_slot" && key !== "vehicle_images" && value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, String(value));
        }
      });
    };

    appendToFormData(formData.vehicleInfo);
    appendToFormData(formData.sellerInfo);
    appendToFormData(formData.purchaseInfo);
    appendToFormData(formData.conditionInfo);

    return formDataToSend;
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData, getFormDataForSubmission }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);