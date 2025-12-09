import React from 'react';
import { X, Search, Clock, LayoutGrid, Disc, Chrome } from 'lucide-react';

const SHORTCUTS = [
    { name: 'Google', url: 'https://google.com', icon: <Chrome size={20} /> },
    { name: 'Notion', url: 'https://notion.so', icon: <LayoutGrid size={20} /> },
    { name: 'Spotify', url: 'https://spotify.com', icon: <Disc size={20} /> },
];

const Widget: React.FC = () => {
    // view state is now just launcher or settings if needed, but for now just launcher
    // We can keep 'view' if we want other sub-menus, but removing focus ones
    const handleLaunch = (url: string) => {
        window.electronAPI.launchBrowser('chrome', url);
    };

    const triggerFocusOverlay = () => {
        window.electronAPI.toggleOverlay(true);
        // Optionally close or minimize widget to keep desktop clean? 
        // For MVP, letting it stay or user can minimize
    };

    const handleClose = () => window.electronAPI.closeWidget();

    return (
        <div className="h-screen w-full bg-color-bg-primary backdrop-blur-xl border border-glass-border flex flex-col overflow-hidden select-none" style={{ borderRadius: '14px' }}>
            {/* Header / Drag Handle */}
            <div className="h-8 w-full flex justify-between items-center px-3 app-drag-region cursor-move shrink-0">
                <span className="text-[11px] font-medium text-text-secondary tracking-wide">CEREVRO</span>
                <div className="flex gap-2">
                    <button onClick={handleClose} className="text-text-secondary hover:text-text-primary no-drag transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* VIEWS */}
            <div className="flex-1 overflow-hidden relative">

                {/* LAUNCHER VIEW (Always visible for now) */}
                <div className="p-4 flex flex-col h-full animate-fade-in">
                    <div className="relative mb-4 no-drag">
                        <Search size={14} className="absolute left-2.5 top-2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-8 pr-2 py-1.5 bg-color-bg-secondary rounded-lg text-sm focus:bg-color-bg-tertiary outline-none border border-transparent focus:border-accent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-6 no-drag">
                        {SHORTCUTS.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => handleLaunch(s.url)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-color-bg-secondary flex items-center justify-center text-text-primary group-hover:bg-color-accent group-hover:text-white transition-all shadow-sm">
                                    {s.icon}
                                </div>
                                <span className="text-[10px] text-text-secondary group-hover:text-text-primary">{s.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto no-drag">
                        <button
                            onClick={triggerFocusOverlay}
                            className="w-full py-2 bg-color-bg-secondary hover:bg-color-bg-tertiary rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Clock size={16} className="text-accent" /> Start Focus Session
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Widget;
