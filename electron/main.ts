import { app, BrowserWindow, ipcMain } from 'electron';
import { windowManager } from './windowManager';
import { browserLauncher } from './browserLauncher';

app.whenReady().then(() => {
    // Launcher First: Create Widget Window by default
    windowManager.createWidgetWindow();

    ipcMain.handle('app:open-widget', () => {
        windowManager.createWidgetWindow();
    });

    ipcMain.handle('app:resize-widget', (_, { width, height }) => {
        windowManager.resizeWidget(width, height);
    });

    ipcMain.handle('app:close-widget', () => {
        windowManager.closeWidget();
    });

    ipcMain.handle('app:toggle-overlay', (_, { show }) => {
        if (show) {
            windowManager.createOverlayWindow();
        } else {
            windowManager.closeOverlay();
        }
    });

    ipcMain.handle('app:launch-browser', async (_, { browser, url, profile }) => {
        return browserLauncher.launch(browser, url, profile);
    });

    ipcMain.handle('app:get-browser-profiles', async (_, { browser }) => {
        return browserLauncher.getProfiles(browser);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            windowManager.createWidgetWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
