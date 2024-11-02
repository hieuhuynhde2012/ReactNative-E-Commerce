import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === "1" && password === "1") {
      setUser({ email });
      return true; // Đăng nhập thành công
    } else {
      alert("Invalid credentials");
      return false; // Đăng nhập không thành công
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};