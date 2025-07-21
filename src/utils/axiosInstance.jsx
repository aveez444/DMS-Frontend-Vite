import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const sessionId = localStorage.getItem("session_id");
        const tenantDomain = localStorage.getItem("tenant_domain");
        const apiBaseUrl = localStorage.getItem("api_base_url");
        const authHeaders = localStorage.getItem("auth_headers");

        // Use tenant's API base URL if available, otherwise use the main backend URL
        if (apiBaseUrl) {
            config.baseURL = `${apiBaseUrl}/api/`;
        } else {
            config.baseURL = import.meta.env.VITE_BACKEND_URL || "https://dms-g7vw.onrender.com/api/";
        }

        // Add session ID header
        if (sessionId) {
            config.headers["X-Session-Id"] = sessionId;
            config.headers["X-Session-ID"] = sessionId; // Backend might expect this format
        }

        // Add tenant domain header
        if (tenantDomain) {
            config.headers["X-Tenant-Domain"] = tenantDomain;
        }

        // Add any additional auth headers from login response
        if (authHeaders) {
            try {
                const parsedHeaders = JSON.parse(authHeaders);
                Object.keys(parsedHeaders).forEach(key => {
                    config.headers[key] = parsedHeaders[key];
                });
            } catch (error) {
                console.error("Error parsing auth headers:", error);
            }
        }

        console.log("Request config:", {
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log("Unauthorized or forbidden, clearing localStorage and redirecting to login");
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;