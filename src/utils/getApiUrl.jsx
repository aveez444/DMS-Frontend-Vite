// src/utils/getApiUrl.js

export const getApiUrl = (endpoint) => {
  // Check if user is logged in and has tenant-specific API URL
  const apiBaseUrl = localStorage.getItem("api_base_url");
  
  let baseURL;
  if (apiBaseUrl) {
    // Use tenant-specific API URL for authenticated requests
    baseURL = `${apiBaseUrl}/api/`;
  } else {
    // Use main backend URL for login and unauthenticated requests
    baseURL = import.meta.env.VITE_BACKEND_URL || "https://dms-g7vw.onrender.com/api/";
  }
  
  const url = `${baseURL}${endpoint}`;
  console.log("🔗 API URL:", url);
  return url;
};