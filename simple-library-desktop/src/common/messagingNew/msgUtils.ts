import {BrowserWindow, ipcMain} from "electron";

export function asChannel(prefix: string, id: string): string {
	return prefix + "." + id;
}

export interface IpcWrapper {
	process: "main" | "renderer",
	ipcMain?: Electron.IpcMain,
	ipcRenderer?: Electron.IpcRenderer,
	browserWindow?: BrowserWindow
}

export function rendererIpcWrapper(): IpcWrapper {
	return {
		process: "renderer",
		ipcRenderer: window.require('electron').ipcRenderer
	}
}

export function mainIpcWrapper(browserWindow?: BrowserWindow): IpcWrapper {
	return {
		process: "main",
		ipcMain: ipcMain,
		browserWindow: browserWindow
	}
}
