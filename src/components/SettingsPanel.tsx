import React, { useState } from 'react';
import { X, Calendar, Check, Plus } from 'lucide-react';

const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'shortcuts' | 'integrations'>('shortcuts');
    const [calendarConnected, setCalendarConnected] = useState(false);

    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 bg-color-bg-primary backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl animate-fade-in origin-bottom z-50">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="font-semibold text-white">Settings</h3>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg mb-4">
                <button
                    onClick={() => setActiveTab('shortcuts')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'shortcuts' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                >
                    Shortcuts
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'integrations' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                >
                    Integrations
                </button>
            </div>

            <div className="h-48 overflow-y-auto custom-scrollbar pr-1">
                {activeTab === 'shortcuts' && (
                    <div className="space-y-2">
                        {['Google', 'Notion', 'Spotify'].map(app => (
                            <div key={app} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 group">
                                <span className="text-sm">{app}</span>
                                <button className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                            </div>
                        ))}
                        <button className="w-full py-2 border border-dashed border-white/20 rounded text-xs text-white/40 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                            <Plus size={12} /> Add Shortcut
                        </button>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar size={16} className="text-accent" /> Calendar Sync
                            </div>
                            <p className="text-[11px] text-white/50">Get notified 2 minutes before meetings start.</p>

                            {!calendarConnected ? (
                                <button
                                    onClick={() => setCalendarConnected(true)}
                                    className="mt-1 w-full py-1.5 bg-accent text-white rounded text-xs font-medium hover:brightness-110 active:scale-95 transition-all"
                                >
                                    Connect Google Calendar
                                </button>
                            ) : (
                                <div className="mt-1 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-1.5 rounded justify-center">
                                    <Check size={12} /> Sync Active
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;
