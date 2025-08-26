'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer, { ToastItem } from '@/components/ui/ToastContainer';

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
  showLoading: (title: string, message?: string) => string;
  dismissToast: (id: string) => void;
  dismissLoading: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = generateId();
    const newToast: ToastItem = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissLoading = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  }, [showToast]);

  const showLoading = useCallback((title: string, message?: string) => {
    return showToast({
      type: 'loading',
      title,
      message,
      duration: 0 // Loading toasts don't auto-dismiss
    });
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
    dismissLoading
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </ToastContext.Provider>
  );
};
