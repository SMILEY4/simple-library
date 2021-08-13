import {ipcMain, MainProcessIpc, RendererProcessIpc} from "electron-better-ipc";
import {buildCompositeEventId, EventConsumerConfig} from "./event";

export class EventConsumer {

    private readonly config: EventConsumerConfig;
    private readonly ipcMainProc: MainProcessIpc | null = null;
    private readonly ipcRendererProc: RendererProcessIpc | null = null;

    private listenerAll: ((eventId: string, payload: any) => (any | Promise<any>)) | null = null;
    private readonly listenerMap: Map<string, ((payload: any) => any | Promise<any>)> = new Map();

    constructor(config: EventConsumerConfig) {
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
        this.registerListeners();
    }

    public onAll<REQ, RES>(listener: (eventId: string, payload: REQ) => RES | Promise<RES>) {
        this.listenerAll = listener
    }

    public on<REQ, RES>(eventId: string, listener: (payload: REQ) => RES | Promise<RES>) {
        this.listenerMap.set(eventId, listener)
    }

    public clearAll() {
        this.listenerAll = null;
        this.listenerMap.clear();
    }

    public clear(eventId: string) {
        this.listenerMap.delete(eventId);
    }

    private registerListeners() {
        this.config.eventIds.forEach(eventId => this.registerListener(eventId, response => {
            return this.handleEvent(eventId, response);
        }))
    }

    private registerListener(eventId: string, callback: (response: any) => any) {
        switch (this.config.comPartner.partner) {
            case "main": {
                this.registerMainListener(eventId, callback);
                break;
            }
            case "renderer": {
                this.registerRendererListener(eventId, callback);
                break;
            }
        }
    }

    private registerMainListener(eventId: string, callback: (response: any) => any) {
        this.ipcRendererProc.answerMain(buildCompositeEventId(eventId, this.config.eventIdPrefix, null), response => callback(response))
    }

    private registerRendererListener(eventId: string, callback: (response: any) => any) {
        this.ipcMainProc.answerRenderer(buildCompositeEventId(eventId, this.config.eventIdPrefix, null), response => callback(response))
    }

    private handleEvent(eventId: string, event: any): any | null {
        if (this.listenerMap.has(eventId)) {
            const listener = this.listenerMap.get(eventId);
            return listener(event);
        } else if (this.listenerAll) {
            return this.listenerAll(eventId, event)
        } else {
            return null;
        }
    }
}
