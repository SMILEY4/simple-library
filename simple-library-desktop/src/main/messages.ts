export function requestSwitchToMainScreen(ipc: Electron.IpcRenderer) {
    ipc.send("screens.switch.request.main")
}

export function onRequestSwitchToMainScreen(ipc: Electron.IpcMain, action: () => void) {
    ipc.on("screens.switch.request.main", action)
}

export function switchedToMainScreen(window: Electron.BrowserWindow) {
    window.webContents.send("screens.switch.done.main")
}

export function onSwitchedToMainScreen(ipc: Electron.IpcRenderer, action: () => void) {
    ipc.on("screens.switch.done.main", action)
}


export function requestSwitchToWelcomeScreen(ipc: Electron.IpcRenderer) {
    ipc.send("screens.switch.request.welcome")
}

export function onRequestSwitchToWelcomeScreen(ipc: Electron.IpcMain, action: () => void) {
    ipc.on("screens.switch.request.welcome", action)
}

export function switchedToWelcomeScreen(window: Electron.BrowserWindow) {
    window.webContents.send("screens.switch.done.welcome")
}

export function onSwitchedToWelcomeScreen(ipc: Electron.IpcRenderer, action: () => void) {
    ipc.on("screens.switch.done.welcome", action)
}