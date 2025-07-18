import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { useFormData } from "./FormDataContext";

const SellerInformation = ({ onNext, onBack, onClose }) => {
  const { formData, updateFormData } = useFormData();

  const [sellerData, setSellerData] = useState({
    seller_name_company_name: formData.sellerInfo?.seller_name_company_name || "",
    mobile_number: formData.sellerInfo?.mobile_number || "",
    email_address: formData.sellerInfo?.email_address || null,
  });

  const [proofOfOwnershipFile, setProofOfOwnershipFile] = useState(
    formData.sellerInfo?.proof_of_ownership_document || null
  );

  const [purchaseData, setPurchaseData] = useState({
    purchase_price: formData.purchaseInfo?.purchase_price || "0.00",
    date_of_purchase: formData.purchaseInfo?.date_of_purchase || new Date().toISOString().split("T")[0],
  });

  const [paymentSlots, setPaymentSlots] = useState(
    formData.purchaseInfo?.payment_slot || []
  );

  const PAYMENT_MODE_CHOICES = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "upi", label: "UPI" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
  ];

  const handleInputChange = (e, stateSetter) => {
    const { name, value } = e.target;
    stateSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProofOfOwnershipFile(file);
    }
  };

  const addPaymentSlot = () => {
    setPaymentSlots([
      ...paymentSlots,
      {
        slot_number: `Slot ${paymentSlots.length + 1}`,
        date_of_payment: new Date().toISOString().split("T")[0],
        amount_paid: "",
        payment_mode: "cash",
        payment_remark: "",
      },
    ]);
  };

  const handlePaymentSlotChange = (index, field, value) => {
    const updatedSlots = [...paymentSlots];
    updatedSlots[index][field] = value;
    setPaymentSlots(updatedSlots);
  };

  const handleSubmit = () => {
    if (!sellerData.seller_name_company_name || !sellerData.mobile_number) {
      alert("Seller Name and Mobile Number are required.");
      return;
    }

    if (sellerData.mobile_number.length !== 10) {
      alert("Mobile Number must be exactly 10 digits.");
      return;
    }

    for (let i = 0; i < paymentSlots.length; i++) {
      const slot = paymentSlots[i];
      if (!slot.amount_paid || parseFloat(slot.amount_paid) <= 0) {
        alert(`Payment slot ${slot.slot_number}: Amount paid must be greater than zero.`);
        return;
      }
      if (!slot.date_of_payment) {
        alert(`Payment slot ${slot.slot_number}: Date of payment is required.`);
        return;
      }
    }

    updateFormData("sellerInfo", {
      ...sellerData,
      proof_of_ownership_document: proofOfOwnershipFile,
    });

    updateFormData("purchaseInfo", {
      ...purchaseData,
      payment_slot: paymentSlots,
    });

    onNext();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-5xl 
                      max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl z-10"
        >
          <IoClose />
        </button>
        <aside className="hidden md:flex md:w-[25%] bg-gray-50 border-r p-4 flex-col">
          <h2 className="text-lg font-semibold mb-3">Add Vehicle</h2>
          <ul className="text-sm">
            {["Vehicle Info", "Seller Info", "Inspection"].map((step, index) => (
              <li
                key={index}
                className={`py-2 px-3 mb-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-200 transition ${
                  index === 1 ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-center md:text-left mb-4">Seller Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              {[
                { label: "Seller Name / Company", name: "seller_name_company_name" },
                { label: "Mobile Number", name: "mobile_number" },
                { label: "Email Address", name: "email_address", type: "email", optional: true },
              ].map(({ label, name, type, optional }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {label}{optional ? " (Optional)" : ""}
                  </label>
                  <input
                    type={type || "text"}
                    name={name}
                    value={sellerData[name] || ""}
                    onChange={(e) => handleInputChange(e, setSellerData)}
                    className="border rounded p-2 h-10 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder={`Enter ${label}`}
                  />
                </div>
              ))}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-gray-700 font-medium mb-1">
                  Proof of Ownership Document
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="border rounded p-2 h-10 text-sm"
                />
                {proofOfOwnershipFile && (
                  <p className="mt-1 text-xs text-green-600">
                    File selected: {proofOfOwnershipFile.name}
                  </p>
                )}
              </div>
            </div>
            <h3 className="text-md font-semibold mb-4">Purchase Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              {[
                { label: "Purchase Price", name: "purchase_price", type: "number" },
                { label: "Date of Purchase", name: "date_of_purchase", type: "date" },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={purchaseData[name]}
                    onChange={(e) => handleInputChange(e, setPurchaseData)}
                    className="border rounded p-2 h-10 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              ))}
            </div>
            <h3 className="text-md font-semibold mb-4">Payment Slots</h3>
            <button
              type="button"
              onClick={addPaymentSlot}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <FaPlus /> Add Payment Slot
            </button>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Slot</th>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Amount</th>
                    <th className="border p-2 text-left">Mode</th>
                    <th className="border p-2 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentSlots.map((slot, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={slot.slot_number}
                          onChange={(e) => handlePaymentSlotChange(index, "slot_number", e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          value={slot.date_of_payment}
                          onChange={(e) => handlePaymentSlotChange(index, "date_of_payment", e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={slot.amount_paid}
                          onChange={(e) => handlePaymentSlotChange(index, "amount_paid", e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          value={slot.payment_mode}
                          onChange={(e) => handlePaymentSlotChange(index, "payment_mode", e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        >
                          {PAYMENT_MODE_CHOICES.map((mode) => (
                            <option key={mode.value} value={mode.value}>
                              {mode.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={slot.payment_remark}
                          onChange={(e) => handlePaymentSlotChange(index, "payment_remark", e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t bg-white sticky bottom-0">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInformation;