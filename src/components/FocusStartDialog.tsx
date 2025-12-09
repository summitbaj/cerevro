import React, { useState } from 'react';
import Dialog from './Dialog';

interface FocusStartDialogProps {
    onClose: () => void;
    onStart: (duration: number) => void;
}

const FocusStartDialog: React.FC<FocusStartDialogProps> = ({ onClose, onStart }) => {
    const [duration, setDuration] = useState(25);
    const [description, setDescription] = useState('');

    const presetDurations = [15, 25, 45, 60];

    return (
        <Dialog
            isOpen={true}
            onClose={onClose}
            title="Start Focus Session"
            width="400px"
            primaryAction={{
                label: 'Start Focus',
                onClick: () => onStart(duration)
            }}
            secondaryAction={{
                label: 'Cancel',
                onClick: onClose
            }}
        >
            {/* Duration Selector */}
            <div className="mb-6">
                <div className="flex items-center justify-center gap-4 mb-5">
                    <button
                        onClick={() => setDuration(Math.max(5, duration - 5))}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        tabIndex={0}
                    >
                        −
                    </button>
                    <div className="text-center min-w-[100px]">
                        <div className="text-5xl font-semibold text-gray-900 tracking-tight tabular-nums leading-none">
                            {duration}
                        </div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mt-1">minutes</div>
                    </div>
                    <button
                        onClick={() => setDuration(Math.min(120, duration + 5))}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        tabIndex={0}
                    >
                        +
                    </button>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-4 gap-2">
                    {presetDurations.map(preset => (
                        <button
                            key={preset}
                            onClick={() => setDuration(preset)}
                            className={`py-1.5 rounded-[6px] text-[13px] font-medium transition-all shadow-sm ${duration === preset
                                ? 'bg-blue-50 text-blue-600 border border-blue-200 ring-1 ring-blue-500/10'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {preset}m
                        </button>
                    ))}
                </div>
            </div>

            {/* Optional Description */}
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Goal (Optional)
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What are you working on?"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
            </div>
        </Dialog>
    );
};

export default FocusStartDialog;
