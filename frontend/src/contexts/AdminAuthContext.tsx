import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  pin: string;
  login: (pin: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  const login = useCallback((enteredPin: string) => {
    setPin(enteredPin);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setPin('');
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, pin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
