import axios from "axios";

export const login = async (username, password) => {
  try {
    console.log("🔥 Starting login attempt...", {
      username,
      backend_url: import.meta.env.VITE_BACKEND_URL,
      full_url: `${import.meta.env.VITE_BACKEND_URL}universal-login/`
    });

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}universal-login/`,
      { username, password },
      { 
        withCredentials: true,
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("✅ Login response received:", {
      status: response.status,
      data: response.data
    });
    
    if (response.data.success) {
      const { tenant, session_id, user, auth_headers } = response.data;
      
      console.log("📦 Storing auth data:", {
        session_id,
        tenant_domain: tenant.domain,
        tenant_id: tenant.id,
        user_uuid: user.uuid,
        api_base_url: tenant.api_base_url,
        auth_headers
      });
      
      localStorage.setItem("session_id", session_id);
      localStorage.setItem("tenant_domain", tenant.domain);
      localStorage.setItem("tenant_id", tenant.id);
      localStorage.setItem("user_uuid", user.uuid);
      localStorage.setItem("api_base_url", tenant.api_base_url);
      localStorage.setItem("auth_headers", JSON.stringify(auth_headers));

      const authData = {
        user: { id: user.id, username: user.username, email: user.email, uuid: user.uuid },
        tenant: { id: tenant.id, domain: tenant.domain, api_base_url: tenant.api_base_url },
        session_id,
        auth_headers
      };
      
      console.log("🚀 Returning auth data:", authData);
      return authData;
    }
    
    console.error("❌ Login failed - success is false");
    throw new Error("Login failed");
  } catch (error) {
    console.error("💥 Login error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};