import {EventSenderOptions} from "./eventSender";
import {EventReceiverOptions} from "./eventReceiver";

export function buildId(eventId: string, options: EventSenderOptions | EventReceiverOptions): string {
    return (options.idPrefix ? (options.idPrefix + ".") : "")
        + eventId
        + (options.idSuffix ? ("." + options.idSuffix) : "")
}


export function logHeader(id: string, traceId: string, dir: "in" | "out", ipcWrapperProc: string): string {
    return "(" + traceId + ")[" + (dir === "in" ? ">" : "") + ipcWrapperProc + "/" + id + (dir === "out" ? ">" : "") + "]";
}


export function logPayload(id: string, payload: any, suppressPayloadLog: boolean | string[]): any {
    if(Array.isArray(suppressPayloadLog)) {
        if ((suppressPayloadLog as string[]).indexOf(id) !== -1) {
            return "<payload>";
        } else {
            return payload;
        }
    } else {
        if (suppressPayloadLog === true) {
            return "<payload>";
        } else {
            return payload;
        }
    }
}
