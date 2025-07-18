// src/utils/getApiUrl.js
export const getApiUrl = (endpoint, useUniversal = false) => {
  if (useUniversal) {
    return `http://127.0.0.1:8000/${endpoint}`;
  }

  const hostname = window.location.hostname; // e.g., "dealership1.localhost"
  const tenantDomain = hostname.includes(".localhost")
    ? hostname
    : localStorage.getItem("tenant_domain") || "127.0.0.1";

  console.log("Generated API URL:", `http://${tenantDomain}:8000/${endpoint}`);
  return `http://${tenantDomain}:8000/${endpoint}`;
};
