import React, { useState } from 'react';
import { useTaskStore } from '../stores/useTaskStore';
import { X, Maximize2, Minimize2, Play, Pause, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const Widget: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [taskInput, setTaskInput] = useState('');
    const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();

    const topTasks = tasks.filter(t => !t.completed).slice(0, 3);

    const toggleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (newCollapsedState) {
            window.electronAPI.resizeWidget(300, 80);
        } else {
            window.electronAPI.resizeWidget(300, 520); // Increased height for music player
        }
    };

    const handleClose = () => {
        window.electronAPI.closeWidget();
    };

    const handleAddTask = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && taskInput.trim()) {
            addTask(taskInput.trim());
            setTaskInput('');
        }
    };

    return (
        <div className={`h-screen w-full bg-color-bg-glass backdrop-blur-md border border-glass-border flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center px-4' : 'p-4'}`} style={{ borderRadius: '16px' }}>
            {/* Drag Handle */}
            <div className="h-6 w-full flex justify-end items-center mb-1 app-drag-region cursor-move absolute top-2 right-2 z-20">
                <div className="flex gap-2">
                    <button onClick={toggleCollapse} className="text-text-secondary hover:text-text-primary no-drag transition-colors">
                        {isCollapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                    <button onClick={handleClose} className="text-text-secondary hover:text-danger no-drag transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {isCollapsed ? (
                <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-xl font-bold text-accent font-mono">25:00</span>
                    <button className="text-xs premium-button py-1 px-2 no-drag flex items-center gap-1">
                        <Play size={10} fill="currentColor" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="text-center mt-4 mb-6">
                        <h2 className="text-4xl font-bold text-accent font-mono tracking-tight">25:00</h2>
                        <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">Pomodoro Focus</p>
                    </div>

                    <div className="flex gap-3 justify-center mb-6 no-drag">
                        <button className="premium-button w-24 flex items-center justify-center gap-2">
                            <Play size={14} fill="currentColor" /> Start
                        </button>
                        <button className="premium-button bg-color-bg-secondary w-24 border border-glass-border flex items-center justify-center gap-2">
                            <Pause size={14} fill="currentColor" /> Pause
                        </button>
                    </div>

                    <div className="border-t border-glass-border pt-4 flex-1 flex flex-col min-h-0 mb-4">
                        <p className="text-xs text-text-secondary mb-3 uppercase font-semibold">Priority Tasks</p>

                        <div className="flex-1 overflow-y-auto no-drag space-y-2 mb-3 pr-1 custom-scrollbar">
                            {topTasks.length === 0 ? (
                                <p className="text-sm text-text-secondary italic text-center py-2">No pending tasks</p>
                            ) : (
                                topTasks.map(task => (
                                    <div key={task.id} className="group flex items-center gap-2 bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                                        <button onClick={() => toggleTask(task.id)} className="text-text-secondary hover:text-accent">
                                            {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                        <span className={`text-sm truncate flex-1 ${task.completed ? 'line-through text-text-secondary' : ''}`}>{task.text}</span>
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="relative no-drag mt-auto">
                            <input
                                type="text"
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                onKeyDown={handleAddTask}
                                placeholder="Add new task..."
                                className="w-full bg-color-bg-secondary border border-glass-border rounded-md text-sm py-2 pl-3 pr-8 outline-none focus:border-accent"
                            />
                            <button onClick={() => { if (taskInput.trim()) { addTask(taskInput.trim()); setTaskInput(''); } }} className="absolute right-2 top-2 text-text-secondary hover:text-accent">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="no-drag border-t border-glass-border pt-4">
                        <MusicPlayer />
                    </div>
                </>
            )}
        </div>
    );
};

export default Widget;
