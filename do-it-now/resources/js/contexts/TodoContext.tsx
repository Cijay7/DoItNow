import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';

import api from '../lib/axios';

interface Todo {
    id: string;
    judul: string;
    deskripsi: string;
    tenggat: string;
    prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
    selesai: boolean;
    created_at: string;
}

interface TodoContextType {
    todos: Todo[] | undefined;
    isLoading: boolean;
    addTodo: (newTodo: Omit<Todo, 'id' | 'selesai' | 'created_at'>) => Promise<Todo>;
    updateTodo: (todo: Partial<Todo> & { id: string }) => Promise<Todo>;
    deleteTodo: (id: string) => Promise<void>;
}

interface TodoProviderProps {
    children: ReactNode;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: TodoProviderProps) {
    const queryClient = useQueryClient();

    // Fetch todos
    const { data: todos, isLoading } = useQuery({
        queryKey: ['todos'] as const,
        queryFn: async () => {
            const response = await api.get<Todo[]>('/todos');
            return response.data;
        },
    });

    // Add todo
    const addTodoMutation = useMutation({
        mutationFn: async (newTodo: Omit<Todo, 'id' | 'selesai' | 'created_at'>) => {
            const response = await api.post<Todo>('/todos', newTodo);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // Update todo
    const updateTodoMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Todo> & { id: string }) => {
            const response = await api.put<Todo>(`/todos/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // Delete todo
    const deleteTodoMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/todos/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    return (
        <TodoContext.Provider
            value={{
                todos,
                isLoading,
                addTodo: addTodoMutation.mutateAsync,
                updateTodo: updateTodoMutation.mutateAsync,
                deleteTodo: deleteTodoMutation.mutateAsync,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
}

export function useTodo(): TodoContextType {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within a TodoProvider');
    }
    return context;
}
