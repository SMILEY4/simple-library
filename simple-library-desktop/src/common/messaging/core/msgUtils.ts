import {BrowserWindow, ipcMain} from "electron";

export const ERROR_RESPONSE_MARKER: string = "error-response";

export interface ErrorResponse {
	status: string,
	body?: any,
}

export function errorResponse(body?: any): ErrorResponse {
	return {
		status: ERROR_RESPONSE_MARKER,
		body: body,
	};
}

export function asChannel(prefix: string, id: string): string {
	return prefix + "." + id;
}

export function asReplyChannel(prefix: string): string {
	return "reply." + prefix;
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
