'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20';
      case 'error':
        return 'border-red-500/20';
      case 'warning':
        return 'border-amber-500/20';
      case 'info':
        return 'border-blue-500/20';
      case 'loading':
        return 'border-slate-500/20';
      default:
        return 'border-slate-500/20';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5';
      case 'error':
        return 'bg-red-500/5';
      case 'warning':
        return 'bg-amber-500/5';
      case 'info':
        return 'bg-blue-500/5';
      case 'loading':
        return 'bg-slate-500/5';
      default:
        return 'bg-slate-500/5';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-xl
        ${getBorderColor()}
        ${getBackgroundColor()}
        bg-slate-900/95 shadow-2xl
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : ''}
        min-w-[320px] max-w-[420px]
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-100 mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          
          {type !== 'loading' && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 group"
            >
              <X className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors duration-200" />
            </button>
          )}
        </div>
      </div>
      
      {/* Progress bar for non-loading toasts */}
      {type !== 'loading' && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/30">
          <div
            className={`h-full transition-all duration-300 ease-linear ${
              type === 'success' ? 'bg-emerald-400' :
              type === 'error' ? 'bg-red-400' :
              type === 'warning' ? 'bg-amber-400' :
              type === 'info' ? 'bg-blue-400' :
              'bg-slate-400'
            }`}
            style={{
              width: isExiting ? '0%' : '100%',
              transitionDuration: isExiting ? '300ms' : `${duration}ms`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
