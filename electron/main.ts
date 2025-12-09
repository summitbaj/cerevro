import { app, BrowserWindow, ipcMain } from 'electron';
import { windowManager } from './windowManager';
import { browserLauncher } from './browserLauncher';

app.whenReady().then(() => {
    windowManager.createMainWindow();

    ipcMain.handle('app:open-widget', () => {
        windowManager.createWidgetWindow();
    });

    ipcMain.handle('app:resize-widget', (_, { width, height }) => {
        windowManager.resizeWidget(width, height);
    });

    ipcMain.handle('app:close-widget', () => {
        windowManager.closeWidget();
    });

    ipcMain.handle('app:launch-browser', async (_, { browser, url, profile }) => {
        return browserLauncher.launch(browser, url, profile);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            windowManager.createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
