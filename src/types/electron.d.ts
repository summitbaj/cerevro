export interface ElectronAPI {
    openWidget: () => Promise<void>;
    resizeWidget: (width: number, height: number) => Promise<void>;
    closeWidget: () => Promise<void>;
    launchBrowser: (browser: 'chrome' | 'edge' | 'firefox', url: string, profile?: string) => Promise<boolean>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
