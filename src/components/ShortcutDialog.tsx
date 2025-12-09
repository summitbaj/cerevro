import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';

interface BrowserProfile {
    name: string;
    directory: string;
}

interface ShortcutData {
    name: string;
    url: string;
    browser: 'chrome' | 'edge';
    profile: string;
}

interface ShortcutDialogProps {
    onClose: () => void;
    onSave: (data: ShortcutData) => void;
}

const ShortcutDialog: React.FC<ShortcutDialogProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [browser, setBrowser] = useState<'chrome' | 'edge'>('chrome');
    const [profile, setProfile] = useState('Default');
    const [browserProfiles, setBrowserProfiles] = useState<BrowserProfile[]>([]);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                if (window.electronAPI?.getBrowserProfiles) {
                    const profiles = await window.electronAPI.getBrowserProfiles(browser);
                    setBrowserProfiles(profiles);
                    setProfile(profiles[0]?.directory || 'Default');
                } else {
                    // Fallback for browser dev
                    setBrowserProfiles([{ name: 'Default', directory: 'Default' }]);
                }
            } catch (error) {
                console.error('Error loading profiles:', error);
                setBrowserProfiles([{ name: 'Default', directory: 'Default' }]);
            }
        };
        loadProfiles();
    }, [browser]);

    const handleSave = () => {
        if (!name || !url) return;
        onSave({ name, url, browser, profile });
    };

    const isValid = name.trim().length > 0 && url.trim().length > 0;

    return (
        <Dialog
            isOpen={true}
            onClose={onClose}
            title="Add Shortcut"
            width="400px"
            primaryAction={{
                label: 'Add Shortcut',
                onClick: handleSave,
                disabled: !isValid
            }}
            secondaryAction={{
                label: 'Cancel',
                onClick: onClose
            }}
        >
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Website"
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        autoFocus
                    />
                </div>

                {/* URL */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        URL
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                </div>

                {/* Browser & Profile Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                            Browser
                        </label>
                        <select
                            value={browser}
                            onChange={(e) => setBrowser(e.target.value as 'chrome' | 'edge')}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer"
                        >
                            <option value="chrome">Chrome</option>
                            <option value="edge">Edge</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                            Profile
                        </label>
                        <select
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer"
                        >
                            {browserProfiles.map(p => (
                                <option key={p.directory} value={p.directory}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ShortcutDialog;
