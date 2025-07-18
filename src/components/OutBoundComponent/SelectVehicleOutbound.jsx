import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SelectVehicleOutbound = ({ closeModal, onSelectVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/dealership/live-inventory/");
        const data = response.data;
        
        if (Array.isArray(data)) {
          // Fetch images for each vehicle
          const vehiclesWithImages = await Promise.all(
            data.map(async (vehicle) => {
              try {
                const imageResponse = await axiosInstance.get(
                  `/dealership/vehicles/${vehicle.vehicle_id}/images/`
                );
                const imageUrls = imageResponse.data.map((img) => img.image_url);
                return { ...vehicle, vehicle_image_urls: imageUrls };
              } catch (imgError) {
                console.error(`Error fetching images for vehicle ${vehicle.vehicle_id}:`, imgError);
                return { ...vehicle, vehicle_image_urls: [] };
              }
            })
          );
          setVehicles(vehiclesWithImages);
        } else {
          setVehicles([]);
          setError("No vehicles found in inventory");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        setError("Failed to load vehicles. Please try again.");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVehicles();
    }
  }, [user, navigate]);

  const handleVehicleSelect = (vehicle) => {
    onSelectVehicle(vehicle);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicle_make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.license_plate_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center">Loading vehicles...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white w-full max-w-3xl mx-4 p-4 md:p-6 rounded-md shadow-md relative" style={{ maxHeight: "90vh" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Add Outbound</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 focus:outline-none text-lg">
            ✖
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-4">Select Vehicle</h3>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by vehicle make or plate number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.vehicle_id}
              onClick={() => handleVehicleSelect(vehicle)}
              className="border rounded-md p-2 md:p-4 cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={
                  vehicle.vehicle_image_urls && vehicle.vehicle_image_urls.length > 0
                    ? vehicle.vehicle_image_urls[0]
                    : "https://via.placeholder.com/150"
                }
                alt={vehicle.vehicle_make}
                className="w-full h-28 md:h-32 object-cover rounded-md mb-2"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              <h4 className="text-sm md:text-lg font-semibold">{vehicle.vehicle_make}</h4>
              <p className="text-xs md:text-sm text-gray-600">
                {vehicle.license_plate_number ? (
                  <>License Plate: {vehicle.license_plate_number}</>
                ) : (
                  <span className="text-gray-400">No License Plate Available</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No vehicles found</p>
        )}
      </div>
    </div>
  );
};

export default SelectVehicleOutbound;