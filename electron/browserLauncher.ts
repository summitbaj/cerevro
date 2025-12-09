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
}

export const browserLauncher = new BrowserLauncher();
