import {app, screen, BrowserWindow} from 'electron';
import {
    onRequestSwitchToMainScreen,
    onRequestSwitchToWelcomeScreen,
    switchedToMainScreen,
    switchedToWelcomeScreen
} from "./messages";

const ipcMain = require('electron').ipcMain
const isDev: boolean = !app.isPackaged;
let browserWindow: Electron.BrowserWindow | null = null


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

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
    })
    browserWindow.setAlwaysOnTop(true)
    if (isDev) {
        browserWindow.loadURL('http://localhost:8080')
        browserWindow.webContents.openDevTools()
    } else {
        browserWindow.loadFile('./.webpack/renderer/index.html')
    }
}
