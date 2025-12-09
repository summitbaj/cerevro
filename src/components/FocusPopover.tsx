import React, { useState } from 'react';
import { Play, Minus, Plus } from 'lucide-react';

const FocusPopover: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [duration, setDuration] = useState(25);

    const increment = () => setDuration(prev => Math.min(120, prev + 5));
    const decrement = () => setDuration(prev => Math.max(5, prev - 5));

    const onStart = () => {
        onClose();
        // Pass duration to overlay via window property
        (window as any).focusDuration = duration;
        window.electronAPI.toggleOverlay(true);
    };

    return (
        <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-72 bg-white/95 backdrop-blur-2xl border border-white/40 rounded-2xl p-5 shadow-2xl animate-fade-in z-50"
            style={{ transformOrigin: 'bottom center' }}
        >
            <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Focus Session</h3>
                <p className="text-xs text-gray-500 mb-4">How long would you like to focus?</p>

                <div className="flex items-center justify-center gap-4 mb-5">
                    <button
                        onClick={decrement}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all flex items-center justify-center text-gray-700"
                    >
                        <Minus size={16} />
                    </button>

                    <div className="text-center min-w-[80px]">
                        <div className="text-4xl font-bold text-gray-900 tabular-nums">{duration}</div>
                        <div className="text-xs text-gray-500 mt-1">minutes</div>
                    </div>

                    <button
                        onClick={increment}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all flex items-center justify-center text-gray-700"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={onStart}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                    <Play size={16} fill="currentColor" />
                    Start Focus
                </button>
            </div>
        </div>
    );
};

export default FocusPopover;
