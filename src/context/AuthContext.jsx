import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tenantDomain, setTenantDomain] = useState(localStorage.getItem("tenant_domain") || null);
    const [tenantId, setTenantId] = useState(localStorage.getItem("tenant_id") || null);
    const [apiBaseUrl, setApiBaseUrl] = useState(localStorage.getItem("api_base_url") || null);
    const [authHeaders, setAuthHeaders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData) => {
        if (!userData) return;
    
        // Clear old data first
        localStorage.removeItem("session_id");
        localStorage.removeItem("tenant_domain");
        localStorage.removeItem("tenant_id");
        localStorage.removeItem("user");
        localStorage.removeItem("user_uuid");
        localStorage.removeItem("api_base_url");
        localStorage.removeItem("auth_headers");
    
        console.log("Setting auth data:", userData);
    
        setUser(userData.user);
        setTenantDomain(userData.tenant.domain);
        setTenantId(userData.tenant.id);
        setApiBaseUrl(userData.tenant.api_base_url);
        setAuthHeaders(userData.auth_headers);
    
        localStorage.setItem("tenant_domain", userData.tenant.domain);
        localStorage.setItem("tenant_id", userData.tenant.id);
        localStorage.setItem("session_id", userData.session_id);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("user_uuid", userData.user.uuid);
        localStorage.setItem("api_base_url", userData.tenant.api_base_url);
        localStorage.setItem("auth_headers", JSON.stringify(userData.auth_headers));
    };
    
    const logout = () => {
        setUser(null);
        setTenantDomain(null);
        setTenantId(null);
        setApiBaseUrl(null);
        setAuthHeaders(null);
        localStorage.removeItem("session_id");
        localStorage.removeItem("tenant_domain");
        localStorage.removeItem("tenant_id");
        localStorage.removeItem("user");
        localStorage.removeItem("user_uuid");
        localStorage.removeItem("api_base_url");
        localStorage.removeItem("auth_headers");
        window.location.href = "/login";
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            const storedSessionId = localStorage.getItem("session_id");
            const storedDomain = localStorage.getItem("tenant_domain");
            const storedTenantId = localStorage.getItem("tenant_id");
            const storedUser = localStorage.getItem("user");
            const storedUuid = localStorage.getItem("user_uuid");
            const storedApiBaseUrl = localStorage.getItem("api_base_url");
            const storedAuthHeaders = localStorage.getItem("auth_headers");

            console.log("Initializing auth with:", {
                storedSessionId,
                storedDomain,
                storedTenantId,
                storedUser,
                storedUuid,
                storedApiBaseUrl,
                storedAuthHeaders
            });

            if (storedSessionId && storedDomain && storedTenantId && storedUser) {
                setTenantDomain(storedDomain);
                setTenantId(storedTenantId);
                setUser(JSON.parse(storedUser));
                setApiBaseUrl(storedApiBaseUrl);
                if (storedAuthHeaders) {
                    setAuthHeaders(JSON.parse(storedAuthHeaders));
                }
            } else {
                console.log("No stored auth data found, clearing state");
                setUser(null);
                setTenantDomain(null);
                setTenantId(null);
                setApiBaseUrl(null);
                setAuthHeaders(null);
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                tenantDomain,
                tenantId,
                apiBaseUrl,
                authHeaders,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};