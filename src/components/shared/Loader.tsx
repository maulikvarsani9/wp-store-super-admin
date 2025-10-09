import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary`}
            />
            {text && <p className="text-sm text-gray-600">{text}</p>}
        </div>
    );
};

export default Loader;

