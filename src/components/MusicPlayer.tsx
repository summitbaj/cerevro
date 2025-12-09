import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

const PRESETS = [
    { name: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { name: 'Synthwave', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
    { name: 'Dark Ambient', url: 'https://www.youtube.com/watch?v=S4ADfd-V19E' },
];

const MusicPlayer: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.5);

    const togglePlay = () => setPlaying(!playing);

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % PRESETS.length);
        setPlaying(true);
    };

    // Cast to any to avoid React 19 type mismatch
    const RP = ReactPlayer as any;

    return (
        <div className="bg-color-bg-secondary rounded p-3 border border-glass-border">
            <div className="hidden">
                <RP
                    url={PRESETS[currentTrack].url}
                    playing={playing}
                    volume={volume}
                    width="0"
                    height="0"
                />
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs text-text-secondary">Now Playing</span>
                    <span className="text-sm font-semibold truncate text-accent">{PRESETS[currentTrack].name}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={togglePlay} className="p-1 rounded hover:bg-white/10 text-text-primary">
                        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <button onClick={nextTrack} className="p-1 rounded hover:bg-white/10 text-text-primary">
                        <SkipForward size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Volume2 size={12} className="text-text-secondary" />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-glass-border rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
