'use client';

import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export interface FormFieldProps {
  label: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  error?: FieldError;
  register: UseFormRegister<Record<string, unknown>>;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  options = [],
  className = '',
  error,
  register,
}: FormFieldProps) {
  return (
    <div className={`mb-4 ${className}`.trim()}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          {...register(name)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {error && error.message && (
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
