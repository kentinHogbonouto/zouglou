'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, User, LogOut, Music, Home, Users, Mail, ChevronDown, HelpCircle } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`bg-white/90 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/images/logo_zouglou.png" alt="Zouglou" width={100} height={100} className="w-[6rem] h-full object-top object-cover" />
              
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
            <Link 
              href="#decouvrir" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
            >
              <Users className="w-4 h-4" />
              Artistes
            </Link>
            <Link 
              href="#contact" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
            <Link 
              href="/faq" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
          </nav>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium">{user.firstName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <Link href={`/dashboard/${user.default_role === 'artist' ? 'artist' : 'admin'}`}>
                        <div className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                          <div className="w-6 h-6 bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 rounded flex items-center justify-center">
                            <Music className="w-3 h-3 text-[#005929]" />
                          </div>
                          <span className="text-sm">Dashboard</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                          <LogOut className="w-3 h-3" />
                        </div>
                        <span className="text-sm">Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Accueil
              </Link>
              <Link 
                href="/artists" 
                className="flex items-center gap-3 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                Artistes
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-3 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Mail className="w-5 h-5" />
                Contact
              </Link>
              <Link 
                href="/faq" 
                className="flex items-center gap-3 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HelpCircle className="w-5 h-5" />
                FAQ
              </Link>
              
              {user && (
                <>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-800">Bonjour, {user.firstName}</span>
                    </div>
                    <Link 
                      href={`/dashboard/${user.default_role === 'artist' ? 'artist' : 'admin'}`}
                      className="flex items-center gap-3 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-slate-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Music className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 