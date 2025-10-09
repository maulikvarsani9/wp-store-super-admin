import React from 'react';
import { useField } from 'formik';

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    autoComplete,
    icon,
    disabled = false,
}) => {
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    {...field}
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`
            appearance-none block w-full px-3 py-2 border rounded-md shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary
            sm:text-sm
            ${icon ? 'pl-10' : ''}
            ${hasError ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
                />
            </div>
            {hasError && (
                <p className="mt-1 text-sm text-red-600">{meta.error}</p>
            )}
        </div>
    );
};

export default FormInput;

