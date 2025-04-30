import { Calendar, CheckCircle, Clock, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useTodo } from '@/contexts/TodoContext';

import { TodoModal } from '@/components/TodoModal';

interface Todo {
    id: string;
    judul: string;
    deskripsi: string;
    prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
    selesai: boolean;
    tenggat: string;
    created_at: string;
}

export default function TodoListPage() {
    const navigate = useNavigate();

    const { todos, isLoading, updateTodo, deleteTodo } = useTodo();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [filter, setFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');

    const handleOpenTodo = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
    };

    const handleAddTodo = () => {
        setSelectedTodo(null);
        setIsModalOpen(true);
    };

    const handleToggleComplete = async (id: string) => {
        const todo = todos?.find((t) => t.id === id);
        if (!todo) return;

        try {
            await updateTodo({
                ...todo,
                selesai: !todo.selesai,
            });
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteTodo(id);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const filteredTodos =
        todos?.filter((todo) => {
            if (filter === 'aktif') return !todo.selesai;
            if (filter === 'selesai') return todo.selesai;
            return true;
        }) || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOverdue = (tenggat: string) => {
        return new Date(tenggat) < new Date();
    };

    const getPriorityColor = (prioritas: Todo['prioritas']) => {
        switch (prioritas) {
            case 'Tinggi':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'Sedang':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'Rendah':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                    <p className="mt-2 text-teal-600">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-50 p-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-teal-700">Do It Now</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/profile')} className="rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setFilter('semua')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'semua' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('aktif')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'aktif' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Aktif
                        </button>
                        <button
                            onClick={() => setFilter('selesai')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'selesai' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Selesai
                        </button>
                    </div>
                    <button onClick={handleAddTodo} className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">
                        <Plus className="mr-2 inline h-4 w-4" /> Tambah Tugas
                    </button>
                </div>

                {filteredTodos.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-teal-100 p-2">
                            <CheckCircle className="h-8 w-8 text-teal-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-medium">Tidak Ada Tugas</h3>
                        <p className="text-gray-600">
                            {filter === 'semua'
                                ? 'Anda belum memiliki tugas. Tambahkan tugas baru untuk memulai.'
                                : filter === 'aktif'
                                  ? 'Anda tidak memiliki tugas aktif saat ini.'
                                  : 'Anda belum menyelesaikan tugas apapun.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`cursor-pointer rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
                                    todo.selesai ? 'border-l-4 border-green-500' : ''
                                } ${!todo.selesai && isOverdue(todo.tenggat) ? 'border-l-4 border-red-500' : ''}`}
                                onClick={() => handleOpenTodo(todo)}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className={`text-lg font-medium ${todo.selesai ? 'text-gray-500 line-through' : ''}`}>{todo.judul}</h3>
                                    <span className={`rounded-full px-3 py-1 text-sm ${getPriorityColor(todo.prioritas)}`}>{todo.prioritas}</span>
                                </div>

                                <p className={`mb-4 text-sm ${todo.selesai ? 'text-gray-500 line-through' : 'text-gray-600'}`}>{todo.deskripsi}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="mr-1 h-4 w-4" />
                                        <span>Tenggat: {formatDate(todo.tenggat)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        <span>Dibuat: {formatDate(todo.created_at)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleComplete(todo.id);
                                        }}
                                        className={`rounded px-3 py-1 text-sm ${
                                            todo.selesai
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {todo.selesai ? 'Batal Selesai' : 'Selesai'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTodo(todo.id);
                                        }}
                                        className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} todo={selectedTodo} />
        </div>
    );
}
