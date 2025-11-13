import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('invoicely_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication - in real app, this would call an API
    const storedUsers = JSON.parse(localStorage.getItem('invoicely_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!existingUser) {
      throw new Error('Invalid email or password');
    }

    const userData: User = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name
    };
    
    setUser(userData);
    localStorage.setItem('invoicely_user', JSON.stringify(userData));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('invoicely_users') || '[]');
    if (storedUsers.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('invoicely_users', JSON.stringify(storedUsers));

    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    };
    
    setUser(userData);
    localStorage.setItem('invoicely_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('invoicely_user');
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would send a password reset email
    console.log('Password reset email sent to:', email);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
