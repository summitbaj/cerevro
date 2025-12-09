import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

const FocusOverlay: React.FC = () => {
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

    useEffect(() => {
        // Get duration from window property set by FocusPopover
        const duration = (window as any).focusDuration || 25;
        setSecondsRemaining(duration * 60);
        setIsActive(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleStop();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive && secondsRemaining > 0) {
            interval = setInterval(() => {
                setSecondsRemaining(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, secondsRemaining]);

    const handleStop = () => {
        setIsActive(false);
        window.electronAPI.toggleOverlay(false);
    };

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const totalSeconds = ((window as any).focusDuration || 25) * 60;
    const progress = Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent text selection
        setIsDragging(true);

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragRef.current) return;

        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;

        setPosition({
            x: dragRef.current.initialX + deltaX,
            y: dragRef.current.initialY + deltaY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragRef.current = null;
    };

    return (
        <div
            className="w-screen h-screen bg-black/70 backdrop-blur-2xl fixed inset-0 z-[99999] flex items-center justify-center select-none animate-fade-in text-white pointer-events-auto"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Draggable Container */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                className="relative bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl min-w-[320px] transition-shadow duration-300 hover:shadow-white/5 pointer-events-auto"
            >
                {/* Header with Close */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-white/50 uppercase tracking-widest">Focus Mode</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleStop(); }}
                        className="p-2 -mr-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
                        aria-label="Close Focus Session"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Timer Display */}
                <div className="text-center mb-6 pointer-events-none">
                    <div className="text-6xl font-bold font-mono tabular-nums tracking-tight mb-2">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                </div>

                {/* Linear Progress Bar */}
                {/* 100% width container */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    {/* Inner bar fills up as progress increases */}
                    <div
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Footer / Status */}
                {secondsRemaining === 0 ? (
                    <div className="mt-4 text-center animate-fade-in">
                        <p className="text-lg font-medium text-white mb-3">Session Complete</p>
                        <button
                            onClick={handleStop}
                            className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors w-full"
                        >
                            Finish
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-xs text-white/30 mt-2 font-medium">
                        Stay in the flow
                    </p>
                )}
            </div>
        </div>
    );
};

export default FocusOverlay;
