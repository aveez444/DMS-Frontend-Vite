import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login: setAuthUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        console.log("🎯 Login form submitted", { username, password: password ? "***" : "empty" });
        
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            console.log("🔄 Calling login API...");
            const authData = await login(username, password);
            console.log("✅ Login successful, received authData:", authData);
            
            console.log("🔄 Setting auth user in context...");
            setAuthUser(authData);
            
            console.log("🔄 Closing modal...");
            closeModal();
            
            console.log("🔄 Navigating to dashboard...");
            navigate(`/dashboard/${authData.user.uuid}`);
            
            console.log("✨ Login flow completed successfully");
        } catch (err) {
            console.error("❌ Login failed:", err);
            const errorMessage = err.response?.data?.error || 
                               err.response?.data?.message || 
                               err.message || 
                               "Login failed. Please try again.";
            setError(errorMessage);
        } finally {
            console.log("🏁 Setting loading to false");
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-[90vw] relative">
                <button 
                    onClick={closeModal}
                    disabled={isLoading}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                >
                    ✕
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-1">Please enter your credentials</p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : "Login"}
                        </button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button 
                            type="button" 
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            onClick={closeModal}
                            disabled={isLoading}
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;