import { app, BrowserWindow } from 'electron';
import { MessageHandler } from './messaging/messageHandler';

const isDev: boolean = !app.isPackaged;
let browserWindow: Electron.BrowserWindow | null = null;

const log = require('electron-log');
Object.assign(console, log.functions);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


function createWindow() {
    browserWindow = new BrowserWindow({
        width: 680,
        height: 420,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
            devTools: process.env.NODE_ENV !== 'production',
        },
    });
    new MessageHandler(browserWindow);
    browserWindow.setAlwaysOnTop(true);
    if (isDev) {
        browserWindow.loadURL('http://localhost:8080');
        browserWindow.webContents.openDevTools();
    } else {
        browserWindow.loadFile('./.webpack/renderer/index.html');
    }
}
