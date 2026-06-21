import React, { createContext, useState, useContext, useEffect } from "react";
import { appParams } from "@/lib/app-params";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    setIsLoadingPublicSettings(false);
    setAuthError(null);
    setAppPublicSettings({ id: appParams.appId, public_settings: {} });
    await checkUserAuth();
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    // Mock user session
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  const logout = (shouldRedirect = true) => {
    localStorage.removeItem("mock_user");
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = "/login";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  // Mock login function for UI usage
  const login = async (email, password) => {
    setIsLoadingAuth(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    const mockUser = { id: 1, email, name: email.split("@")[0] };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        login, // Adding login to context so Login.jsx can use it
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
