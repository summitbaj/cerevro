import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

interface TaskState {
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (text) => set((state) => ({
                tasks: [
                    { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
                    ...state.tasks
                ]
            })),
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),
        }),
        {
            name: 'cerevro-tasks',
        }
    )
);
