import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showInfo: (title: string, message: string) => void;
    showWarning: (title: string, message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(
        (type: Toast['type'], title: string, message: string) => {
            const id = Math.random().toString(36).substring(7);
            const newToast: Toast = { id, type, title, message };

            setToasts(prev => [...prev, newToast]);

            // Auto remove after 5 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 5000);
        },
        []
    );

    const showSuccess = useCallback(
        (title: string, message: string) => addToast('success', title, message),
        [addToast]
    );

    const showError = useCallback(
        (title: string, message: string) => addToast('error', title, message),
        [addToast]
    );

    const showInfo = useCallback(
        (title: string, message: string) => addToast('info', title, message),
        [addToast]
    );

    const showWarning = useCallback(
        (title: string, message: string) => addToast('warning', title, message),
        [addToast]
    );

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider
            value={{
                toasts,
                showSuccess,
                showError,
                showInfo,
                showWarning,
                removeToast,
            }}
        >
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-lg shadow-lg max-w-sm ${toast.type === 'success'
                                ? 'bg-green-500 text-white'
                                : toast.type === 'error'
                                    ? 'bg-red-500 text-white'
                                    : toast.type === 'warning'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-blue-500 text-white'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="font-semibold">{toast.title}</h4>
                                <p className="text-sm mt-1">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-4 text-white hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

