// src/utils/getApiUrl.js
// src/utils/getApiUrl.js

export const getApiUrl = (endpoint) => {
  const baseURL = import.meta.env.VITE_BACKEND_URL || "https://web-production-88115.up.railway.app/api/";
  const url = `${baseURL}${endpoint}`;
  console.log("🔗 API URL:", url);
  return url;
};
