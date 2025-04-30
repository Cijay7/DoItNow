import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Todo, useTodo } from '@/contexts/TodoContext';

type PrioritasType = 'Rendah' | 'Sedang' | 'Tinggi';

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    todo: Todo | null;
}

export function TodoModal({ isOpen, onClose, todo }: TodoModalProps) {
    const { addTodo, updateTodo } = useTodo();

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tenggat, setTenggat] = useState('');
    const [tenggatTime, setTenggatTime] = useState('');
    const [prioritas, setPrioritas] = useState<PrioritasType>('Sedang');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (todo) {
            setJudul(todo.judul);
            setDeskripsi(todo.deskripsi);

            if (todo.waktu_tenggat) {
                const tenggatDate = new Date(todo.waktu_tenggat);
                setTenggat(tenggatDate.toISOString().split('T')[0]);
                setTenggatTime(`${tenggatDate.getHours().toString().padStart(2, '0')}:${tenggatDate.getMinutes().toString().padStart(2, '0')}`);
            } else {
                setTenggat('');
                setTenggatTime('');
            }

            setPrioritas(todo.prioritas);
        } else {
            resetForm();
        }
    }, [todo]);

    const resetForm = () => {
        setJudul('');
        setDeskripsi('');
        setTenggat('');
        setTenggatTime('');
        setPrioritas('Sedang');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let waktu_tenggat: string | null = null;
            if (tenggat) {
                const tenggatDateTime = new Date(tenggat);

                if (tenggatTime) {
                    const [hours, minutes] = tenggatTime.split(':').map(Number);
                    tenggatDateTime.setHours(hours, minutes);
                } else {
                    // If no time is set, default to start of day
                    tenggatDateTime.setHours(0, 0);
                }

                waktu_tenggat = tenggatDateTime.toISOString();
            }

            const todoData = {
                judul,
                deskripsi,
                waktu_tenggat,
                prioritas,
            };

            if (todo) {
                await updateTodo({ id: todo.id, ...todoData });
                toast('Tugas Diperbarui', {
                    description: `${todo.judul} telah diperbarui`,
                });
            } else {
                await addTodo(todoData);
                toast('Tugas Ditambahkan', {
                    description: `${todoData.judul} telah ditambahkan`,
                });
            }

            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving todo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <h2 className="mb-4 text-xl font-bold">{todo ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul</label>
                        <input
                            type="text"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Tenggat</label>
                            <div className="mt-1 flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                <input
                                    type="date"
                                    value={tenggat}
                                    onChange={(e) => setTenggat(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Waktu Tenggat</label>
                            <div className="mt-1 flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                <input
                                    type="time"
                                    value={tenggatTime}
                                    onChange={(e) => setTenggatTime(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                        <select
                            value={prioritas}
                            onChange={(e) => setPrioritas(e.target.value as PrioritasType)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                        >
                            {isLoading ? 'Menyimpan...' : todo ? 'Perbarui' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
