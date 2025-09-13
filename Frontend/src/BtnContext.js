import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const[info,setInfo]=useState(false)

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <LoginContext.Provider value={{ user, login, logout,info,setInfo,setUser }}>
      {children}
    </LoginContext.Provider>
  );
};
