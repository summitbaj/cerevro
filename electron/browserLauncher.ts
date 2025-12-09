import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export type BrowserType = 'chrome' | 'edge' | 'firefox';

interface BrowserProfile {
    name: string;
    directory: string; // Internal name of profile dir (e.g., "Profile 1", "Default")
}

class BrowserLauncher {
    constructor() { }

    /**
     * Launch a browser with a specific profile and URL
     */
    launch(browser: BrowserType, url: string, profile?: string) {
        let command = '';
        let args: string[] = [];

        switch (browser) {
            case 'chrome':
                command = this.getChromePath();
                args = [url, '--new-window'];
                if (profile) {
                    args.push(`--profile-directory=${profile}`);
                }
                break;
            case 'edge':
                command = this.getEdgePath();
                args = [url, '--new-window'];
                if (profile) {
                    args.push(`--profile-directory=${profile}`);
                }
                break;
            // Firefox logic is more complex with -P, skipping for MVP/focus on Chromium first
        }

        if (command && fs.existsSync(command)) {
            console.log(`Launching ${command} with args:`, args);
            // Detach the process so it doesn't close when Electron closes (optional, user preference)
            const child = spawn(command, args, {
                detached: true,
                stdio: 'ignore'
            });
            child.unref();
            return true;
        } else {
            console.error(`Browser ${browser} not found at ${command}`);
            return false;
        }
    }

    getChromePath(): string {
        if (process.platform === 'win32') {
            return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            // Also check Program Files (x86) or local app data if needed
        } else if (process.platform === 'darwin') {
            return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        }
        return '';
    }

    getEdgePath(): string {
        if (process.platform === 'win32') {
            return 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        }
        return '';
    }

    /**
     * Get list of available profiles for a browser
     */
    getProfiles(browser: BrowserType): BrowserProfile[] {
        const profiles: BrowserProfile[] = [];
        let userDataPath = '';

        if (browser === 'chrome') {
            if (process.platform === 'win32') {
                userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
            } else if (process.platform === 'darwin') {
                userDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome');
            }
        } else if (browser === 'edge') {
            if (process.platform === 'win32') {
                userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data');
            }
        }

        if (!userDataPath || !fs.existsSync(userDataPath)) {
            return [{ name: 'Default', directory: 'Default' }];
        }

        try {
            const items = fs.readdirSync(userDataPath);

            // Add Default profile
            if (fs.existsSync(path.join(userDataPath, 'Default'))) {
                profiles.push({ name: 'Default', directory: 'Default' });
            }

            // Add numbered profiles (Profile 1, Profile 2, etc.)
            items.forEach(item => {
                if (item.startsWith('Profile ')) {
                    const prefsPath = path.join(userDataPath, item, 'Preferences');
                    if (fs.existsSync(prefsPath)) {
                        try {
                            const prefs = JSON.parse(fs.readFileSync(prefsPath, 'utf-8'));
                            const profileName = prefs.profile?.name || item;
                            profiles.push({ name: profileName, directory: item });
                        } catch {
                            profiles.push({ name: item, directory: item });
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error reading profiles:', error);
            return [{ name: 'Default', directory: 'Default' }];
        }

        return profiles.length > 0 ? profiles : [{ name: 'Default', directory: 'Default' }];
    }
}

export const browserLauncher = new BrowserLauncher();
