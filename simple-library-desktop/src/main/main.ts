import * as path from 'path';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import {app, BrowserWindow, screen} from 'electron';
import {
    onRequestSwitchToMainScreen,
    onRequestSwitchToWelcomeScreen,
    switchedToMainScreen,
    switchedToWelcomeScreen
} from "_main/Messages";
import {loadLibrary} from "_main/persistence/DataAccess";

const ipcMain = require('electron').ipcMain

let browserWindow: Electron.BrowserWindow | null;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (browserWindow === null) {
        createWindow()
    }
});

onRequestSwitchToWelcomeScreen(ipcMain, () => {
    if (browserWindow) {
        browserWindow.setSize(680, 420)
        browserWindow.setResizable(false)
        browserWindow.center()
        switchedToWelcomeScreen(browserWindow)
    }
})

onRequestSwitchToMainScreen(ipcMain, () => {
    if (browserWindow) {
        // const windowBounds = browserWindow.getBounds()
        // const currentScreen = screen.getDisplayNearestPoint({x: windowBounds.x, y: windowBounds.y})
        const cursor = screen.getCursorScreenPoint()
        const currentScreen = screen.getDisplayNearestPoint({x: cursor.x, y: cursor.y})
        const {width, height} = currentScreen.workAreaSize
        browserWindow.setResizable(true)
        browserWindow.setSize(width, height)
        browserWindow.setPosition(0, 0)
        switchedToMainScreen(browserWindow)
    }
})


function createWindow(): void {
    loadLibrary("C:\\Users\\LukasRuegner\\Desktop\\mydatabase")
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
    })
    browserWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    ).finally(() => { /* no action */
    });
    browserWindow.on('closed', () => browserWindow = null)
}