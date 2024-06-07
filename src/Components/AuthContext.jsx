import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    const storedToken = Cookies.get('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const loginUser = (user, token) => {
    setUser(user);
    setToken(token);
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
    Cookies.set('token', token, { expires: 1 });
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('user');
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
