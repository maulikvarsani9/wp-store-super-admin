import React from 'react';

interface FormTextareaProps {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    error?: string;
    touched?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
    label,
    name,
    placeholder,
    required = false,
    rows = 3,
    disabled = false,
    value,
    onChange,
    onBlur,
    error,
    touched,
}) => {
    const hasError = touched && error;

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
                id={name}
                name={name}
                rows={rows}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
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
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormTextarea;

