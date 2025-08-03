'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`bg-green-900 shadow-lg border-b border-green-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
                Zouglou
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-200 hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link 
              href="/artists" 
              className="text-gray-200 hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Artistes
            </Link>
            <Link 
              href="/playlists" 
              className="text-gray-200 hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Playlists
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-200 hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-200 text-sm">
                    Bonjour, {user.firstName}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 