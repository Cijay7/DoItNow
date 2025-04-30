import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import api from '../lib/axios';

interface User {
    id: string;
    nama: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, password_confirmation: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get<User>('/user');
                setUser(response.data);
            }
        } catch (error: unknown) {
            console.log(error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        interface LoginResponse {
            token: string;
            user: User;
        }

        const response = await api.post<LoginResponse>('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    const register = async (email: string, password: string, password_confirmation: string, nama: string): Promise<void> => {
        interface RegisterResponse {
            token: string;
            user: User;
        }

        const response = await api.post<RegisterResponse>('/register', {
            email,
            password,
            password_confirmation,
            nama,
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    const logout = async (): Promise<void> => {
        await api.post('/logout');
        localStorage.removeItem('token');
        setUser(null);
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
