import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('user-id');
    const storedToken = localStorage.getItem('auth-token');
    
    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    } else {
      // Create anonymous user if none exists
      const anonymousUserId = localStorage.getItem('anonymous-user-id');
      if (anonymousUserId) {
        setUserId(anonymousUserId);
        setIsLoggedIn(true);
      } else {
        // Generate a unique ID for anonymous user
        const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('anonymous-user-id', newId);
        setUserId(newId);
        setIsLoggedIn(true);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll simulate authentication
      console.log('Login attempt with:', email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a mock user ID (in a real app, this would come from the server)
      const mockUserId = `user_${Date.now()}`;
      setUserId(mockUserId);
      setIsLoggedIn(true);
      localStorage.setItem('user-id', mockUserId);
      localStorage.setItem('auth-token', 'mock-jwt-token');
      
      // Remove anonymous user data
      localStorage.removeItem('anonymous-user-id');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to register
      console.log('Registration attempt with:', email, name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a mock user ID (in a real app, this would come from the server)
      const mockUserId = `user_${Date.now()}`;
      setUserId(mockUserId);
      setIsLoggedIn(true);
      localStorage.setItem('user-id', mockUserId);
      localStorage.setItem('auth-token', 'mock-jwt-token');
      
      // Remove anonymous user data
      localStorage.removeItem('anonymous-user-id');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem('user-id');
    localStorage.removeItem('auth-token');
    
    // Create new anonymous user
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymous-user-id', newId);
    
    setUserId(newId);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ userId, isLoggedIn, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};