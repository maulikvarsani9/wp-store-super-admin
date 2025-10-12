import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import { setNavigateFunction } from './utils/navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Authors from './pages/Authors';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import Settings from './pages/Settings';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: unknown) => {
                // Don't retry on 4xx errors (client errors)
                const status = (error as { response?: { status?: number } })?.response
                    ?.status;
                if (status && status >= 400 && status < 500) {
                    return false;
                }
                // Retry up to 1 time for other errors
                return failureCount < 1;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            retry: false, // Don't retry mutations by default
        },
    },
});

// App Routes Component
const AppRoutes: React.FC = () => {
    const navigate = useNavigate();

    // Set up navigation function for API interceptor
    React.useEffect(() => {
        setNavigateFunction(navigate);
    }, [navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/categories" replace />} />
                <Route path="categories" element={<Categories />} />
                <Route path="authors" element={<Authors />} />
                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/add" element={<BlogForm />} />
                <Route path="blogs/edit/:id" element={<BlogForm />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

// Main App Component
function App() {
    // Global error handler for unhandled promise rejections
    React.useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled promise rejection:', event.reason);
        };

        const handleError = (event: ErrorEvent) => {
            console.error(
                'Global error:',
                event.error?.message || event.error || 'Unknown error'
            );
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener(
                'unhandledrejection',
                handleUnhandledRejection
            );
            window.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;

