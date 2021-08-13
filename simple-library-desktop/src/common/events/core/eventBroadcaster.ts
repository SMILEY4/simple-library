import {ipcMain, MainProcessIpc, RendererProcessIpc} from "electron-better-ipc";
import {BrowserWindow} from "electron";
import {buildCompositeEventId, ERR_RESPONSE_TYPE, ErrorResponse, EventBroadcasterConfig} from "./event";

export class EventBroadcaster {

    private readonly config: EventBroadcasterConfig;
    private readonly ipcMainProc: MainProcessIpc | null = null;
    private readonly ipcRendererProc: RendererProcessIpc | null = null;

    constructor(config: EventBroadcasterConfig) {
        this.config = config;
        switch (config.comPartner.partner) {
            case "main": {
                this.ipcRendererProc = window.require("electron-better-ipc").ipcRenderer
                break;
            }
            case "renderer": {
                this.ipcMainProc = ipcMain;
                break;
            }
        }
    }

    public send<RESPONSE>(eventId: string, event?: any): Promise<RESPONSE> {
        return this.sendToPartner(eventId, event).then((response: any) => {
            if (response && response.type === ERR_RESPONSE_TYPE) {
                throw (response as ErrorResponse).error
            } else {
                return response;
            }
        })
    }

    private sendToPartner(eventId: string, event: any): Promise<any> {
        switch (this.config.comPartner.partner) {
            case "main":
                return this.sendToMain(eventId, event);
            case "renderer":
                return this.sendToRenderer(eventId, event);
        }
    }

    private sendToMain(eventId: string, event: any): Promise<any> {
        return this.ipcRendererProc.callMain(buildCompositeEventId(eventId, this.config.eventIdPrefix, null), event);
    }

    private sendToRenderer(eventId: string, event: any): Promise<any> {
        return this.ipcMainProc.callRenderer(this.getBrowserWindow(), buildCompositeEventId(eventId, this.config.eventIdPrefix, null), event)
    }

    private getBrowserWindow(): null | BrowserWindow {
        if (this.config.comPartner.partner === "renderer" && !!this.config.comPartner.window) {
            return (this.config.comPartner.window instanceof Function)
                ? this.config.comPartner.window()
                : this.config.comPartner.window;
        } else {
            return null;
        }
    }

}

