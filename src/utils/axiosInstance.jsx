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
        const currentHost = tenantDomain || "localhost";

        const apiDomain = import.meta.env.VITE_BACKEND_URL || "https://web-production-88115.up.railway.app/api/";
            config.baseURL = apiDomain;


        if (sessionId) {
            config.headers["X-Session-Id"] = sessionId;
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
            window.location.href = "http://localhost:3000/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;