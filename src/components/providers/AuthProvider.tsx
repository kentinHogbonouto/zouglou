'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({
        id: '1',
        email: 'user@example.com',
        firstName: 'Utilisateur',
        lastName: 'Test',
        username: 'utilisateur_test',
        role: 'user',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Utilisateur',
        lastName: 'Connecté',
        username: 'utilisateur_connecte',
        role: 'user',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token');
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      const mockUser: User = {
        id: '2',
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        username: userData.username || 'nouveau_utilisateur',
        role: 'user',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token');
    } catch (error) {
      throw new Error('Échec de l\'inscription');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
} 