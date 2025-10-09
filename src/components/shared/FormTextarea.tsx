import React from 'react';
import { useField } from 'formik';

interface FormTextareaProps {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
    label,
    name,
    placeholder,
    required = false,
    rows = 3,
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
            <textarea
                {...field}
                id={name}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                className={`
          appearance-none block w-full px-3 py-2 border rounded-md shadow-sm
          placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary
          sm:text-sm
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
            />
            {hasError && (
                <p className="mt-1 text-sm text-red-600">{meta.error}</p>
            )}
        </div>
    );
};

export default FormTextarea;

