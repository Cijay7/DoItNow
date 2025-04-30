import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TodoProvider } from './contexts/TodoContext';

import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';

const queryClient = new QueryClient();

interface PrivateRouteProps {
    children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps): React.JSX.Element {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TodoProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/todo-list"
                            element={
                                <PrivateRoute>
                                    <TodoListPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                    <Toaster />
                </TodoProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
