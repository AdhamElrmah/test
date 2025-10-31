import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  const signin = async (email, password) => {
    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to sign in");
    }
    const data = await res.json();
    const u = {
      ...data.user,
      avatar:
        data.user.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
      token: data.token,
    };
    setUser(u);
    return u;
  };

  const signup = async (email, password, name, role) => {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to sign up");
    }
    const data = await res.json();
    const u = {
      ...data.user,
      avatar:
        data.user.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
      token: data.token,
    };
    setUser(u);
    return u;
  };

  const signout = () => {
    setUser(null);
    // remove token
    localStorage.removeItem("user");
  };

  const value = {
    user,
    signin,
    signup,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
