"use client";

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true
}: ModalProps) {
  // Fermer la modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md w-full mx-4',
    md: 'max-w-lg w-full mx-4',
    lg: 'max-w-2xl w-full mx-4',
    xl: 'max-w-4xl w-full mx-4',
    full: 'w-full h-full max-w-none mx-0 rounded-none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay avec effet de flou */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal avec animation */}
      <div 
        className={cn(
          'relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-0 overflow-hidden transition-all duration-300 transform',
          sizeClasses[size],
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture flottant */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        {/* Contenu */}
        <div className="relative max-h-[95vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Composant pour les boutons de la modal avec les couleurs du projet
export function ModalButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border border-slate-200',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 hover:from-[#FE5200]/90 hover:to-[#FE5200] text-white shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        variant === 'primary' && 'focus:ring-[#005929]/50',
        variant === 'secondary' && 'focus:ring-slate-500/50',
        variant === 'danger' && 'focus:ring-red-500/50',
        variant === 'success' && 'focus:ring-[#FE5200]/50'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Composant pour les actions de la modal
export function ModalActions({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex justify-end gap-3 pt-6 border-t border-slate-200/60",
      className
    )}>
      {children}
    </div>
  );
}

// Composant pour le header de la modal
export function ModalHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "border-b border-slate-200/60 pb-6",
      className
    )}>
      {children}
    </div>
  );
}

// Composant pour le contenu de la modal
export function ModalContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "p-8",
      className
    )}>
      {children}
    </div>
  );
} 