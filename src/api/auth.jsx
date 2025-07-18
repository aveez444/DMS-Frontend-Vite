import axios from "axios";

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}universal-login/`,
      { username, password },
      { withCredentials: true }
    );
    
    console.log("Login response:", response.data);
    
    if (response.data.success) {
      const { tenant, session_id, user } = response.data;
      
      console.log("Storing auth data:", {
        session_id,
        tenant_domain: tenant.domain,
        tenant_id: tenant.id,
        user_uuid: user.uuid
      });
      
      localStorage.setItem("session_id", session_id);
      localStorage.setItem("tenant_domain", tenant.domain);
      localStorage.setItem("tenant_id", tenant.id);
      localStorage.setItem("user_uuid", user.uuid);

      return {
        user: { id: user.id, username: user.username, email: user.email, uuid: user.uuid },
        tenant: { id: tenant.id, domain: tenant.domain },
        session_id,
      };
    }
    throw new Error("Login failed");
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};