import {BrowserWindow} from "electron";
import {MainProcessIpc, RendererProcessIpc} from "electron-better-ipc";

const {ipcMain: ipcMain} = require("electron-better-ipc");

export interface IpcWrapper {
    process: "main" | "renderer" | "worker",
    ipcMain?: MainProcessIpc,
    ipcRenderer?: RendererProcessIpc,
    browserWindow?: BrowserWindow | (() => BrowserWindow),
}

export function ipcComWith(partner: "main" | "renderer" | "worker", targetBrowserWindow?: BrowserWindow | (() => BrowserWindow)): IpcWrapper {
    switch (partner) {
        case "main": {
			return rendererIpcWrapper();
        }
        case "renderer": {
			return mainIpcWrapper(targetBrowserWindow)
        }
    }
}

export function workerIpcWrapper(): IpcWrapper {
    return {
        process: "worker",
        ipcRenderer: window.require("electron-better-ipc").ipcRenderer
    };
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
