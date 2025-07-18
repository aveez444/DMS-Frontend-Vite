// utils/tokenManager.js
import axios from "axios";

export const fetchValidToken = async () => {
  try {
    const response = await axios.get("http://dealership1.localhost:8000/accounts/api/get-token/", {
      withCredentials: true,  // only needed if you're using cookies/session
    });

    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return access;
  } catch (err) {
    console.error("🚫 Failed to fetch valid JWT", err);
    return null;
  }
};
