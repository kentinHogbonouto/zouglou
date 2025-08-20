import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Input } from './Input';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  register,
  error,
  className = '',
  required = false,
  disabled = false,
  autoComplete,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={register.name} className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Input
        id={register.name}
        type={type}
        {...register}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
      />
      {error && (
        <p className="text-red-400 text-xs">{error.message}</p>
      )}
    </div>
  );
}

interface FormCheckboxProps {
  label: React.ReactNode;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

export function FormCheckbox({
  label,
  register,
  error,
  className = '',
}: FormCheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <input
        type="checkbox"
        {...register}
        className={`mt-1 rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 ${className}`}
      />
      <div className="flex-1">
        <span className="text-sm text-gray-200">{label}</span>
        {error && (
          <p className="text-red-400 text-xs mt-1">{error.message}</p>
        )}
      </div>
    </div>
  );
} 