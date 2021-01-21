import { app, BrowserWindow, screen } from 'electron';
import {
    onRequestCreateLibrary,
    onRequestSwitchToWelcomeScreen,
    SuccessResponse,
    switchedToWelcomeScreen,
} from './messages';
import DataAccess from './persistence/dataAccess';

const ipcMain = require('electron').ipcMain;
const isDev: boolean = !app.isPackaged;
let browserWindow: Electron.BrowserWindow | null = null;


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

onRequestSwitchToWelcomeScreen(ipcMain, () => {
    if (browserWindow) {
        browserWindow.setSize(680, 420);
        browserWindow.setResizable(false);
        browserWindow.center();
        switchedToWelcomeScreen(browserWindow);
    }
});

onRequestCreateLibrary(ipcMain, (path: string, name: string) => {
    const filePath: string = DataAccess.createLibrary(path, name);
    if (browserWindow) {
        // const windowBounds = browserWindow.getBounds()
        // const currentScreen = screen.getDisplayNearestPoint({x: windowBounds.x, y: windowBounds.y})
        const cursor = screen.getCursorScreenPoint();
        const currentScreen = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
        const { width, height } = currentScreen.workAreaSize;
        browserWindow.setResizable(true);
        browserWindow.setSize(width, height);
        browserWindow.setPosition(0, 0);
    }
    const response: SuccessResponse = {
        payload: {
            filePath: filePath,
        },
    };
    return response;
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
    // browserWindow.setAlwaysOnTop(true);
    if (isDev) {
        browserWindow.loadURL('http://localhost:8080');
        browserWindow.webContents.openDevTools();
    } else {
        browserWindow.loadFile('./.webpack/renderer/index.html');
    }
}
