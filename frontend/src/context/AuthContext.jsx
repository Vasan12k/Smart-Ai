import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../config/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode token to get user info (simple decode without verification)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, role: payload.role });
      } catch (e) {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Set up axios interceptor once
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        config.headers.authorization = `Bearer ${currentToken}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to backend server. Please start the backend on port 4000."
        );
      }
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to backend server. Please start the backend on port 4000."
        );
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
