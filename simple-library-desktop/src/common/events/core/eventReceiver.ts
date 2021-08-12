import {IpcWrapper} from "../../messaging/core/ipcWrapper";
import {MsgDefaultEntity, MsgEntity} from "../../messaging/core/msgEntity";
import {BrowserWindow} from "electron";
import {EventSenderOptions} from "./eventSender";
import {buildId, logHeader, logPayload} from "./eventUtils";

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
        } : DEFAULT_OPTIONS;
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
        const id = buildId(eventId, this.options);
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
        const strLogHeader = logHeader(eventId, msgEntity.traceId, "in", this.ipcWrapper.process);
        console.debug(strLogHeader, "handle", logPayload(eventId, msgEntity.body, this.options.suppressPayloadLog), "from", window ? window.getTitle() : "null");
        const handlerResult = this.listener(eventId, msgEntity.body);
        return Promise.resolve(handlerResult)
            .then((response: any) => {
                console.debug(strLogHeader, "answer", logPayload(eventId, response, this.options.suppressPayloadLog));
                return MsgEntity.entity(msgEntity.traceId, response);
            })
            .catch((err: any) => {
                const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
                console.debug(strLogHeader, "answer error", strError);
                return MsgEntity.error(msgEntity.traceId, strError);
            });
    }



}
