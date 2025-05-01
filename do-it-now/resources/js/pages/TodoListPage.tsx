/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar, CheckCircle, Clock, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { Todo, useTodo } from '@/contexts/TodoContext';

import { TodoModal } from '@/components/TodoModal';
import EnhancedLoadingAnimation from '@/components/loading-animation';

export default function TodoListPage() {
    const navigate = useNavigate();

    const { todos, isLoading, updateTodo, deleteTodo, refreshTodos } = useTodo();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [filter, setFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');

    useEffect(() => {
        const checkOverdueTasks = () => {
            const now = new Date();
            if (todos && todos.length > 0) {
                todos.forEach((todo) => {
                    if (!todo.selesai && todo.waktu_tenggat && new Date(todo.waktu_tenggat) < now) {
                        toast.custom((_t) => (
                            <div
                                style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    padding: '15px',
                                    borderRadius: '6px',
                                    width: '22rem',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: 12 }}>Tugas Tenggat!</div>
                                <div style={{ color: 'white', opacity: 0.9, fontSize: 12 }}>{todo.judul} telah melewati batas waktu</div>
                            </div>
                        ));

                        if (Notification.permission === 'granted') {
                            new Notification('Do It Now - Tugas Tenggat!', {
                                body: `${todo.judul} telah melewati batas waktu`,
                                icon: '/do-it-now-icon.png?height=64&width=64',
                            });
                        }
                    }
                });
            }
        };

        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        checkOverdueTasks();

        // Set interval untuk cek setiap menit
        const interval = setInterval(checkOverdueTasks, 60000);
        return () => clearInterval(interval);
    }, [todos]);

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
            if (!todo.selesai) {
                toast.custom((_t) => (
                    <div
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '6px',
                            width: '22rem',
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: 12 }}>Tugas Selesai</div>
                        <div style={{ color: 'white', opacity: 0.9, fontSize: 12 }}>{todo.judul} telah ditandai selesai</div>
                    </div>
                ));
            } else {
                toast.custom((_t) => (
                    <div
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '6px',
                            width: '22rem',
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: 12 }}>Tugas Dibuka Kembali</div>
                        <div style={{ color: 'white', opacity: 0.9, fontSize: 12 }}>{todo.judul} telah dibuka kembali</div>
                    </div>
                ));
            }
            // Refresh todos
            refreshTodos();
        } catch (error) {
            console.error('Error toggling todo:', error);
            toast.custom((_t) => (
                <div
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '6px',
                        width: '22rem',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: 12 }}>Gagal Memperbarui</div>
                    <div style={{ color: 'white', opacity: 0.9, fontSize: 12 }}>Terjadi kesalahan saat memperbarui tugas</div>
                </div>
            ));
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const todoToDelete = todos && todos.find((todo) => todo.id === id);
            await deleteTodo(id);
            toast('Tugas Dihapus', {
                description: `${todoToDelete?.judul} telah dihapus`,
            });
            // Refresh todos
            refreshTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            toast.custom((_t) => (
                <div
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '6px',
                        width: '22rem',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: 12 }}>Gagal Menghapus</div>
                    <div style={{ color: 'white', opacity: 0.9, fontSize: 12 }}>Terjadi kesalahan saat menghapus tugas</div>
                </div>
            ));
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

    if (isLoading) return <EnhancedLoadingAnimation fullScreen={true} message="Memuat tugas" />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-50 p-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-teal-700">Do It Now</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/profile')}
                            className="h-10 w-10 cursor-pointer rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700"
                        >
                            {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setFilter('semua')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'semua' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            } cursor-pointer`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('aktif')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'aktif' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            } cursor-pointer`}
                        >
                            Aktif
                        </button>
                        <button
                            onClick={() => setFilter('selesai')}
                            className={`rounded-md px-4 py-2 ${
                                filter === 'selesai' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            } cursor-pointer`}
                        >
                            Selesai
                        </button>
                    </div>
                    <button onClick={handleAddTodo} className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">
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
                                } ${!todo.selesai && todo.waktu_tenggat && isOverdue(todo.waktu_tenggat) ? 'border-l-4 border-red-500' : ''}`}
                                onClick={() => handleOpenTodo(todo)}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className={`text-lg font-medium ${todo.selesai ? 'text-gray-500 line-through' : ''}`}>{todo.judul}</h3>
                                    <span className={`rounded-full px-3 py-1 text-sm ${getPriorityColor(todo.prioritas)}`}>{todo.prioritas}</span>
                                </div>

                                <p className={`mb-4 text-sm ${todo.selesai ? 'text-gray-500 line-through' : 'text-gray-600'}`}>{todo.deskripsi}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    {todo.waktu_tenggat && (
                                        <div className="flex items-center">
                                            <Clock className="mr-1 h-4 w-4" />
                                            <span>Tenggat: {formatDate(todo.waktu_tenggat)}</span>
                                        </div>
                                    )}
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
