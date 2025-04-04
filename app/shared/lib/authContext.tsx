'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, login, logout, getUserBySession, registerUser } from './auth';

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, name: string, password: string) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session storage key
const SESSION_KEY = 'auth_session_id';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionId = localStorage.getItem(SESSION_KEY);

        if (sessionId) {
          const currentUser = getUserBySession(sessionId);
          if (currentUser) {
            setUser(currentUser);
            // The getSession should be called here to get the actual session object
            // For simplicity, we're creating a placeholder
            setSession({ 
              id: sessionId, 
              userId: currentUser.id, 
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              createdAt: new Date() 
            });
          } else {
            // Session expired or invalid, clear it
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (err) {
        console.error('Failed to load auth session:', err);
        setError('Failed to restore session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login function
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const result = login(username, password);
      
      if (result) {
        setUser(result.user);
        setSession(result.session);
        localStorage.setItem(SESSION_KEY, result.session.id);
        return true;
      } else {
        setError('Invalid credentials');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    const sessionId = session?.id;
    
    if (sessionId) {
      logout(sessionId);
      localStorage.removeItem(SESSION_KEY);
    }
    
    setUser(null);
    setSession(null);
  };

  // Register function
  const handleRegister = async (
    username: string, 
    email: string, 
    name: string, 
    password: string
  ): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const newUser = registerUser(username, email, name, password);
      
      if (newUser) {
        // Auto login after registration
        const result = login(username, password);
        
        if (result) {
          setUser(result.user);
          setSession(result.session);
          localStorage.setItem(SESSION_KEY, result.session.id);
          return true;
        }
      }
      
      setError('Registration failed. Username may already exist.');
      return false;
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 