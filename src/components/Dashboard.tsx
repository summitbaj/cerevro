import React, { useState } from 'react';

const Dashboard: React.FC = () => {
    const [url, setUrl] = useState('https://google.com');
    const [browser, setBrowser] = useState<'chrome' | 'edge'>('chrome');
    const [profile, setProfile] = useState('');

    const handleOpenWidget = () => {
        window.electronAPI.openWidget();
    };

    const handleLaunchBrowser = () => {
        window.electronAPI.launchBrowser(browser, url, profile || undefined);
    };

    return (
        <div className="p-8 h-screen overflow-auto bg-color-bg-primary text-text-primary font-sans">
            <h1 className="text-3xl font-bold mb-6 text-accent">CEREVRO Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl mb-4 text-text-secondary border-b border-glass-border pb-2">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button onClick={handleOpenWidget} className="premium-button">
                            Open Sticky Widget
                        </button>
                    </div>
                </div>

                {/* Smart Browser Launcher */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl mb-4 text-text-secondary border-b border-glass-border pb-2">Smart Browser Launcher</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Target URL</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-color-bg-secondary border border-glass-border rounded p-2 text-text-primary focus:border-accent outline-none"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-text-secondary mb-1">Browser</label>
                                <select
                                    value={browser}
                                    onChange={(e) => setBrowser(e.target.value as any)}
                                    className="w-full bg-color-bg-secondary border border-glass-border rounded p-2 text-text-primary focus:border-accent outline-none"
                                >
                                    <option value="chrome">Chrome</option>
                                    <option value="edge">Edge</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-text-secondary mb-1">Profile (Optional)</label>
                                <input
                                    type="text"
                                    value={profile}
                                    onChange={(e) => setProfile(e.target.value)}
                                    placeholder="Default"
                                    className="w-full bg-color-bg-secondary border border-glass-border rounded p-2 text-text-primary focus:border-accent outline-none"
                                />
                            </div>
                        </div>
                        <button onClick={handleLaunchBrowser} className="premium-button w-full mt-2">
                            Launch Focus Session
                        </button>
                    </div>
                </div>

                {/* Focus Stats Placeholder */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold mb-2">Focus Stats</h3>
                    <p className="text-text-secondary">No sessions recorded today.</p>
                </div>

                {/* Upcoming Placeholder */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold mb-2">Up Next</h3>
                    <p className="text-text-secondary">No upcoming meetings.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
