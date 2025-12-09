export interface ElectronAPI {
    openWidget: () => Promise<void>;
    resizeWidget: (width: number, height: number) => Promise<void>;
    closeWidget: () => Promise<void>;
    toggleOverlay: (show: boolean) => Promise<void>;
    launchBrowser: (browser: string, url: string, profile?: string) => Promise<boolean>;
    getBrowserProfiles: (browser: string) => Promise<Array<{ name: string; directory: string }>>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
