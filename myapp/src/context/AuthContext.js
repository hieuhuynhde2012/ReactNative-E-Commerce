import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Tạo người dùng mặc định với email và mật khẩu "1"
  const [user, setUser] = useState({ email: '1', password: '1' });

  const register = (userData) => {
    // Cập nhật thông tin người dùng sau khi đăng ký thành công
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};
