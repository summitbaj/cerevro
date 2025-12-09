import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    openWidget: () => ipcRenderer.invoke('app:open-widget'),
    resizeWidget: (width: number, height: number) => ipcRenderer.invoke('app:resize-widget', { width, height }),
    closeWidget: () => ipcRenderer.invoke('app:close-widget'),
    launchBrowser: (browser: string, url: string, profile?: string) =>
        ipcRenderer.invoke('app:launch-browser', { browser, url, profile }),
});
