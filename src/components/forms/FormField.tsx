'use client';

import { forwardRef } from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import {
  getFieldErrorClass,
  getErrorMessageClass,
  formatErrorMessage,
} from '@/lib/validation/formUtils';

interface FormFieldProps {
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
  error?: FieldError;
  register: UseFormRegister<any>;
  className?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      required = false,
      disabled = false,
      options = [],
      error,
      register,
      className = '',
      rows = 4,
      min,
      max,
      step,
    },
    ref
  ) => {
    const fieldId = `field-${name}`;
    const errorClass = getFieldErrorClass(error, className);
    const errorMessageClass = getErrorMessageClass();

    const renderField = () => {
      const commonProps = {
        id: fieldId,
        ...register(name),
        placeholder,
        disabled,
        className: `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100 disabled:cursor-not-allowed ${errorClass}`,
      };

      switch (type) {
        case 'textarea':
          return (
            <textarea
              {...commonProps}
              rows={rows}
              ref={ref as React.Ref<HTMLTextAreaElement>}
            />
          );

        case 'select':
          return (
            <select {...commonProps} ref={ref as React.Ref<HTMLSelectElement>}>
              <option value="">Select {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'number':
          return (
            <input
              {...commonProps}
              type="number"
              min={min}
              max={max}
              step={step}
              ref={ref as React.Ref<HTMLInputElement>}
            />
          );

        default:
          return (
            <input
              {...commonProps}
              type={type}
              ref={ref as React.Ref<HTMLInputElement>}
            />
          );
      }
    };

    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {renderField()}

        {error && (
          <p className={errorMessageClass}>{formatErrorMessage(error)}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
