import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useFormData } from "../AddvehicleComponent/FormDataContext";
import VehicleInfo from "../AddvehicleComponent/VehicleInfo";
import SellerInformation from "../AddvehicleComponent/SellerInformation";
import ConditionDetails from "../AddvehicleComponent/ConditionDetails";
import { IoClose } from "react-icons/io5";

const EditVehicleModal = ({ vehicleId, onClose, setVehicle }) => {
  const { updateFormData, getFormDataForSubmission, resetFormData } = useFormData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch vehicle data when component mounts or vehicleId changes
  useEffect(() => {
    if (dataFetched || !vehicleId) return;

    const fetchVehicleData = async () => {
      try {
        resetFormData && resetFormData();
        setLoadingData(true);
        
        const response = await axiosInstance.get(`/dealership/vehicle-detail/${vehicleId}/`);
        const vehicleData = response.data;

        if (vehicleData) {
          // Update all form sections with vehicle data
          updateFormData("vehicleInfo", {
            vehicle_make: vehicleData.vehicle_make,
            vehicle_model: vehicleData.vehicle_model,
            year_of_manufacturing: vehicleData.year_of_manufacturing,
            year_of_registration: vehicleData.year_of_registration,
            chassis_number: vehicleData.chassis_number,
            engine_number: vehicleData.engine_number,
            osn_number: vehicleData.osn_number,
            license_plate_number: vehicleData.license_plate_number,
            odometer_reading_kms: vehicleData.odometer_reading_kms,
            color: vehicleData.color,
            fuel_type: vehicleData.fuel_type,
            transmission_type: vehicleData.transmission_type,
          });

          updateFormData("sellerInfo", {
            seller_name_company_name: vehicleData.seller_name_company_name,
            mobile_number: vehicleData.mobile_number,
            email_address: vehicleData.email_address,
            proof_of_ownership_document: null,
          });

          updateFormData("purchaseInfo", {
            purchase_price: vehicleData.purchase_price,
            date_of_purchase: vehicleData.date_of_purchase,
            payment_slot: vehicleData.payment_slot || [],
            purchase_agreement: null,
          });

          updateFormData("conditionInfo", {
            inspection_date: vehicleData.inspection_date,
            condition_grade: vehicleData.condition_grade,
            damage_details_if_any: vehicleData.damage_details_if_any,
            tires_condition: vehicleData.tires_condition,
            engine_condition: vehicleData.engine_condition,
            interior_condition: vehicleData.interior_condition,
            upload_image_of_vehicle: null,
          });

          setDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error.response || error);
        alert("Failed to load vehicle details. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId, dataFetched, resetFormData, updateFormData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = getFormDataForSubmission();
      formDataToSend.append('vehicle_id', vehicleId);

      const response = await axiosInstance.patch(
        `/dealership/vehicle/update/${vehicleId}/`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (setVehicle && response.data.updated_data) {
        setVehicle(response.data.updated_data);
      }

      alert("Vehicle updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error.response || error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         "Unknown error";
      alert(`Error updating vehicle details: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center text-lg">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl z-10"
          aria-label="Close modal"
        >
          <IoClose />
        </button>

        <div className="p-6 pb-2">
          <h2 className="text-2xl font-bold text-center">Edit Vehicle Details</h2>
          <div className="flex justify-center mt-4 mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Multi-Step Form */}
          {currentStep === 1 && (
            <VehicleInfo onNext={() => setCurrentStep(2)} onClose={onClose} />
          )}
          {currentStep === 2 && (
            <SellerInformation 
              onNext={() => setCurrentStep(3)} 
              onBack={() => setCurrentStep(1)} 
              onClose={onClose} 
            />
          )}
          {currentStep === 3 && (
            <ConditionDetails 
              onNext={handleSubmit} 
              onBack={() => setCurrentStep(2)} 
              onClose={onClose} 
              isSubmitting={isSubmitting} 
              submitButtonText="Update Vehicle"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditVehicleModal;