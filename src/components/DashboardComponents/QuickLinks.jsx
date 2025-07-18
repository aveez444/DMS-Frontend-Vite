import React from "react";
import { AiOutlineCar } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiOutlineFolderOpen } from "react-icons/hi";
import { FaWrench } from "react-icons/fa";
import ModalManager from "../AddvehicleComponent/ModalManager";
import InquiryFormModal from "../InquiryComponents/InquiryFormModal"; // ✅ Inquiry Modal
import { useNavigate, useParams } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();
  const { uuid } = useParams(); // Get UUID from URL params
  const [showModal, setShowModal] = React.useState(false);
  const [showInquiryModal, setShowInquiryModal] = React.useState(false); // ✅ State for Inquiry Modal

  const quickLinks = [
    { 
      label: "Add\nVehicles", 
      icon: <AiOutlineCar />, 
      onClick: () => {
        console.log("Add Vehicle button clicked"); // Debugging
        setShowModal(true);
      }
    },
    { 
      label: "Add Inquiries",  // ✅ Inquiry Button Added Back
      icon: <RiDeleteBinLine />, 
      onClick: () => setShowInquiryModal(true)  // ✅ Opens Inquiry Modal
    },
    { 
      label: "View\nCatalogue", 
      icon: <HiOutlineFolderOpen />, 
      onClick: () => navigate(`/dashboard/${uuid}/catalogue`) // Use actual UUID
    },
    { 
      label: "Maintenance\nRecords", 
      icon: <FaWrench />, 
      onClick: () => navigate(`/dashboard/${uuid}/maintenance`) // Use actual UUID
    },
  ];

  return (
    <div>
      {/* Quick Links Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            onClick={link.onClick}
            className="bg-white shadow-md p-4 flex items-center justify-between rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
            aria-label={`Quick link to ${link.label}`}
            style={{
              padding: "1.5rem",
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            }}
          >
            <p
              className="text-gray-700 font-medium text-left"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                whiteSpace: "pre-wrap",
              }}
            >
              {link.label.split("\n").map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div
              className="text-blue-500 flex-shrink-0"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              }}
            >
              {link.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Add Modal */}
      {showModal && (
        <ModalManager 
          onClose={() => {
            console.log("Closing modal"); // Debugging
            setShowModal(false);
          }}
        />
      )}

      {/* ✅ Inquiry Modal Added Back */}
      {showInquiryModal && (
        <InquiryFormModal 
          closeModal={() => setShowInquiryModal(false)}
        />
      )}
    </div>
  );
};

export default QuickLinks;