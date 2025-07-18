import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tenantDomain, setTenantDomain] = useState(localStorage.getItem("tenant_domain") || null);
    const [tenantId, setTenantId] = useState(localStorage.getItem("tenant_id") || null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData) => {
        if (!userData) return;
    
        // Clear old data first
        localStorage.removeItem("session_id");
        localStorage.removeItem("tenant_domain");
        localStorage.removeItem("tenant_id");
        localStorage.removeItem("user");
        localStorage.removeItem("user_uuid");
    
        console.log("Setting auth data:", userData);
    
        setUser(userData.user);
        setTenantDomain(userData.tenant.domain);
        setTenantId(userData.tenant.id);
    
        localStorage.setItem("tenant_domain", userData.tenant.domain);
        localStorage.setItem("tenant_id", userData.tenant.id);
        localStorage.setItem("session_id", userData.session_id);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("user_uuid", userData.user.uuid);
    };
    
    const logout = () => {
        setUser(null);
        setTenantDomain(null);
        setTenantId(null);
        localStorage.removeItem("session_id");
        localStorage.removeItem("tenant_domain");
        localStorage.removeItem("tenant_id");
        localStorage.removeItem("user");
        localStorage.removeItem("user_uuid");
        window.location.href = "http://localhost:3000/login";
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            const storedSessionId = localStorage.getItem("session_id");
            const storedDomain = localStorage.getItem("tenant_domain");
            const storedTenantId = localStorage.getItem("tenant_id");
            const storedUser = localStorage.getItem("user");
            const storedUuid = localStorage.getItem("user_uuid");

            console.log("Initializing auth with:", {
                storedSessionId,
                storedDomain,
                storedTenantId,
                storedUser,
                storedUuid
            });

            if (storedSessionId && storedDomain && storedTenantId && storedUser) {
                setTenantDomain(storedDomain);
                setTenantId(storedTenantId);
                setUser(JSON.parse(storedUser));
            } else {
                console.log("No stored auth data found, clearing state");
                setUser(null);
                setTenantDomain(null);
                setTenantId(null);
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
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};