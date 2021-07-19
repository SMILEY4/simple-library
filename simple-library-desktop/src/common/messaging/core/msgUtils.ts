import {BrowserWindow} from "electron";
import {MainProcessIpc, RendererProcessIpc} from "electron-better-ipc";

const {ipcMain: ipcMain} = require("electron-better-ipc");

export const ERROR_RESPONSE_MARKER: string = "error-response";

export interface ErrorResponse {
	status: string,
	body?: any,
}

export function errorResponse(body?: any): ErrorResponse {
	return {
		status: ERROR_RESPONSE_MARKER,
		body: body
	};
}

export interface IpcWrapper {
	process: "main" | "renderer",
	ipcMain?: MainProcessIpc,
	ipcRenderer?: RendererProcessIpc,
	browserWindow?: BrowserWindow | (() => BrowserWindow),
}

export function rendererIpcWrapper(): IpcWrapper {
	return {
		process: "renderer",
		ipcRenderer: window.require("electron-better-ipc").ipcRenderer
	};
}

export function mainIpcWrapper(browserWindow?: BrowserWindow | (() => BrowserWindow)): IpcWrapper {
	return {
		process: "main",
		ipcMain: ipcMain,
		browserWindow: browserWindow
	};
}

export function getBrowserWindow(ipcWrapper: IpcWrapper): null | BrowserWindow {
	if (!!ipcWrapper.browserWindow) {
		return (ipcWrapper.browserWindow instanceof Function) ? ipcWrapper.browserWindow() : ipcWrapper.browserWindow;
	} else {
		return null;
	}
}