import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    openWidget: () => ipcRenderer.invoke('app:open-widget'),
    resizeWidget: (width: number, height: number) => ipcRenderer.invoke('app:resize-widget', { width, height }),
    closeWidget: () => ipcRenderer.invoke('app:close-widget'),
    toggleOverlay: (show: boolean) => ipcRenderer.invoke('app:toggle-overlay', { show }),
    launchBrowser: (browser: string, url: string, profile?: string) =>
        ipcRenderer.invoke('app:launch-browser', { browser, url, profile }),
    getBrowserProfiles: (browser: string) =>
        ipcRenderer.invoke('app:get-browser-profiles', { browser }),
});
