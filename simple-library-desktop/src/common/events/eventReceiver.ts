import {IpcWrapper} from "../messaging/core/ipcWrapper";
import {MsgDefaultEntity, MsgEntity} from "../messaging/core/msgEntity";
import {BrowserWindow} from "electron";

export type EventListener = (eventId: string, payload: any) => any

export interface EventReceiverOptions {
    suppressPayloadLog?: string[],
    idPrefix?: string | null,
    idSuffix?: string | null
}

const DEFAULT_OPTIONS: EventReceiverOptions = {
    suppressPayloadLog: [],
    idPrefix: null,
    idSuffix: null
}

export class EventReceiver {

    private static readonly NOOP_LISTENER: EventListener = () => undefined;

    private readonly ipcWrapper: IpcWrapper;
    private readonly options: EventReceiverOptions;
    private listener: EventListener = EventReceiver.NOOP_LISTENER;


    constructor(ipcWrapper: IpcWrapper, options?: EventReceiverOptions) {
        this.ipcWrapper = ipcWrapper;
        this.options = options ? {
            suppressPayloadLog: options.suppressPayloadLog ? options.suppressPayloadLog : DEFAULT_OPTIONS.suppressPayloadLog,
            idPrefix: options.idPrefix ? options.idPrefix : DEFAULT_OPTIONS.idPrefix,
            idSuffix: options.idSuffix ? options.idSuffix : DEFAULT_OPTIONS.idSuffix,
        } : DEFAULT_OPTIONS
    }


    public setListener(listener: EventListener) {
        this.listener = listener;
    }


    public clearListener() {
        this.setListener(EventReceiver.NOOP_LISTENER);
    }


    public addEventId(eventId: string | string[]) {
        if (Array.isArray(eventId)) {
            eventId.forEach(id => this.register(id))
        } else {
            this.register(eventId)
        }
    }


    private register(eventId: string) {
        const id = this.buildId(eventId);
        console.log("REGISTER LISTENER: " + eventId + " - " + id)
        switch (this.ipcWrapper.process) {
            case "main": {
                this.ipcWrapper.ipcMain.answerRenderer(id, (msgEntity: MsgEntity, window: BrowserWindow) => {
                    if (!MsgEntity.isError(msgEntity)) {
                        return this.handleEvent(eventId, msgEntity as MsgDefaultEntity, window);
                    }
                });
                break;
            }
            case "renderer":
            case "worker": {
                this.ipcWrapper.ipcRenderer.answerMain(id, (msgEntity: MsgEntity) => {
                    if (!MsgEntity.isError(msgEntity)) {
                        return this.handleEvent(eventId, msgEntity as MsgDefaultEntity, null);
                    }
                });
                break;
            }
        }
    }

    private handleEvent(eventId: string, msgEntity: MsgDefaultEntity, window: BrowserWindow): Promise<any> {
        const logHeader = this.logHeader(eventId, msgEntity.traceId, "in");
        console.debug(logHeader, "handle", this.logPayload(eventId, msgEntity.body), "from", window ? window.getTitle() : "null");
        const handlerResult = this.listener(eventId, msgEntity.body);
        return Promise.resolve(handlerResult)
            .then((response: any) => {
                console.debug(logHeader, "answer", this.logPayload(eventId, response));
                return MsgEntity.entity(msgEntity.traceId, response);
            })
            .catch((err: any) => {
                const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
                console.debug(logHeader, "answer error", strError);
                return MsgEntity.error(msgEntity.traceId, strError);
            });
    }


    private buildId(eventId: string): string {
        return (this.options.idPrefix ? (this.options.idPrefix + ".") : "")
        + eventId
        + (this.options.idSuffix ? ("." + this.options.idSuffix) : "")
    }


    private logHeader(id: string, traceId: string, dir: "in" | "out"): string {
        return "(" + traceId + ")[" + (dir === "in" ? ">" : "") + this.ipcWrapper.process + "/" + id + (dir === "out" ? ">" : "") + "]";
    }


    private logPayload(id: string, payload: any): any {
        if (this.options.suppressPayloadLog.indexOf(id) === -1) {
            return payload;
        } else {
            return "<payload>";
        }
    }

}
