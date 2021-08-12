import {getBrowserWindow, IpcWrapper} from "../../messaging/core/ipcWrapper";
import {MsgTraceId} from "../../messaging/core/msgTraceId";
import {MsgDefaultEntity, MsgEntity, MsgErrorEntity} from "../../messaging/core/msgEntity";
import {buildId, logHeader, logPayload} from "./eventUtils";

export interface EventSenderOptions {
    suppressPayloadLog?: boolean,
    idPrefix?: string | null,
    idSuffix?: string | null
}

const DEFAULT_OPTIONS: EventSenderOptions = {
    suppressPayloadLog: false,
    idPrefix: null,
    idSuffix: null
}

export class EventSender<REQUEST, RESPONSE> {

    private readonly ipcWrapper: IpcWrapper;
    private readonly options: EventSenderOptions;
    private readonly eventId: string;
    private readonly id: string;


    constructor(eventId: string, ipcWrapper: IpcWrapper, options?: EventSenderOptions) {
        this.eventId = eventId;
        this.ipcWrapper = ipcWrapper;
        this.options = options ? {
            suppressPayloadLog: options.suppressPayloadLog ? options.suppressPayloadLog : DEFAULT_OPTIONS.suppressPayloadLog,
            idPrefix: options.idPrefix ? options.idPrefix : DEFAULT_OPTIONS.idPrefix,
            idSuffix: options.idSuffix ? options.idSuffix : DEFAULT_OPTIONS.idSuffix,
        } : DEFAULT_OPTIONS;
        this.id = buildId(eventId, this.options)
    }


    public sendAndForget(payload: REQUEST, traceId?: string): Promise<void> {
        this.send(payload, traceId).then();
        return Promise.resolve();
    }


    public send(payload: REQUEST, traceId?: string): Promise<RESPONSE> {
        const msgTraceId = !!traceId ? traceId : MsgTraceId.gen();
        console.debug(logHeader(this.id, msgTraceId, "out", this.ipcWrapper.process), "send", logPayload(this.id, payload, this.options.suppressPayloadLog));
        switch (this.ipcWrapper.process) {
            case "main": {
                return this.ipcWrapper.ipcMain.callRenderer(getBrowserWindow(this.ipcWrapper), this.id, MsgEntity.entity(msgTraceId, payload))
                    .then((response: MsgEntity) => this.handleResponse(response));
            }
            case "worker":
            case "renderer": {
                return this.ipcWrapper.ipcRenderer.callMain(this.id, MsgEntity.entity(msgTraceId, payload))
                    .then((response: MsgEntity) => this.handleResponse(response));
            }
            default: {
                return Promise.reject("Unexpected process: " + this.ipcWrapper.process);
            }
        }
    }

    private handleResponse(responseEntity: MsgEntity): Promise<any> {
        console.debug(
            logHeader(this.id, responseEntity.traceId, "out", this.ipcWrapper.process),
            "response",
            logPayload(this.id, MsgEntity.isError(responseEntity) ? (responseEntity as MsgErrorEntity).error : (responseEntity as MsgDefaultEntity).body, this.options.suppressPayloadLog)
        );
        if (MsgEntity.isError(responseEntity)) {
            return this.rejectWithErrorEntity((responseEntity as MsgErrorEntity));
        } else {
            return Promise.resolve((responseEntity as MsgDefaultEntity).body);
        }
    }

    private rejectWithErrorEntity(response: MsgErrorEntity): Promise<any> {
        return Promise.reject(
            (response && response.error)
                ? response.error
                : JSON.stringify(response)
        );
    }


}
