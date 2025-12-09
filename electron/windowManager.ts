import { BrowserWindow, screen } from 'electron';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

class WindowManager {
    private mainWindow: BrowserWindow | null = null;
    private widgetWindow: BrowserWindow | null = null;
    private overlayWindow: BrowserWindow | null = null;

    constructor() { }

    createMainWindow() {
        if (this.mainWindow) {
            this.mainWindow.focus();
            return;
        }

        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
            backgroundColor: '#0a0a0c',
            show: false,
        });

        const url = isDev
            ? 'http://localhost:5173'
            : `file://${path.join(__dirname, '../dist/index.html')}`;

        this.mainWindow.loadURL(url);

        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow?.show();
        });

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    createWidgetWindow() {
        if (this.widgetWindow) {
            this.widgetWindow.focus();
            return;
        }

        const { width } = screen.getPrimaryDisplay().workAreaSize;

        this.widgetWindow = new BrowserWindow({
            width: 300,
            height: 400,
            x: width - 320,
            y: 100,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: true, // Allow manual resize too
            skipTaskbar: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        const url = isDev
            ? 'http://localhost:5173/#/widget'
            : `file://${path.join(__dirname, '../dist/index.html')}#/widget`;

        this.widgetWindow.loadURL(url);

        this.widgetWindow.on('closed', () => {
            this.widgetWindow = null;
        });
    }

    createOverlayWindow() {
        if (this.overlayWindow) {
            this.overlayWindow.focus();
            return;
        }

        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        this.overlayWindow = new BrowserWindow({
            width,
            height,
            x: 0,
            y: 0,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            skipTaskbar: true,
            focusable: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });

        const url = isDev
            ? 'http://localhost:5173/#/overlay'
            : `file://${path.join(__dirname, '../dist/index.html')}#/overlay`;

        this.overlayWindow.loadURL(url);

        this.overlayWindow.on('closed', () => {
            this.overlayWindow = null;
        });
    }

    resizeWidget(width: number, height: number) {
        if (this.widgetWindow) {
            this.widgetWindow.setSize(width, height, true); // true for animate
        }
    }

    closeWidget() {
        if (this.widgetWindow) {
            this.widgetWindow.close();
        }
    }
}

export const windowManager = new WindowManager();
