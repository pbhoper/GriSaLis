import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (accessToken: string, newUserId: number) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', String(newUserId));
    setToken(accessToken);
    setUserId(newUserId);
    setIsModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: !!token,
        isModalOpen,
        login,
        logout,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};