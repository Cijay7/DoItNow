import { LogOut, Save } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

import api from '../lib/axios';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [name, setName] = useState<string>(user?.name || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleUpdateProfile = async (): Promise<void> => {
        setIsLoading(true);
        setError('');

        try {
            await api.put('/user/profile', { name });
            // Update the user context or refetch user data
            // You might need to add this functionality to your AuthContext
        } catch (error: unknown) {
            setError((error as Error).message || 'Terjadi kesalahan saat memperbarui profil.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            navigate('/login');
        } catch (error: unknown) {
            setError('Terjadi kesalahan saat logout.');
            console.log(error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-2xl text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-teal-700">Profil Pengguna</h1>
                    <p className="text-gray-600">Kelola informasi profil Anda</p>
                </div>

                {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>}

                <div className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            value={user?.email}
                            disabled
                        />
                        <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/todo-list')}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={isLoading}
                            className="flex-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                        >
                            {isLoading ? (
                                'Menyimpan...'
                            ) : (
                                <>
                                    <Save className="mr-2 inline h-4 w-4" /> Simpan
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <LogOut className="mr-2 inline h-4 w-4" /> Keluar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
