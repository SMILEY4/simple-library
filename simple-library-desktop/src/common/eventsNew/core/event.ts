import {BrowserWindow} from "electron";


export const ERR_RESPONSE_TYPE: string = "EVENT.ERROR-RESPONSE";

export interface ErrorResponse {
    type: "EVENT.ERROR-RESPONSE",
    error: any
}

export interface EventBroadcasterConfig {
    comPartner: EventMainPartner | EventRendererPartner
    eventIdPrefix?: string,
    suppressPayloadLog?: "all" | string[],
}

export interface EventConsumerConfig {
    eventIds: string[],
    comPartner: EventMainPartner | EventRendererPartner
    eventIdPrefix?: string,
    suppressPayloadLog?: "all" | string[],
}

export interface EventMainPartner {
    partner: "main",
}

export interface EventRendererPartner {
    partner: "renderer",
    window: BrowserWindow | (() => BrowserWindow)
}

export function buildCompositeEventId(eventId: string, prefix: string | undefined | null, suffix: string | undefined | null): string {
    let compId = eventId;
    if (prefix) {
        compId = prefix + "." + compId
    }
    if (suffix) {
        compId = compId + "." + suffix
    }
    return compId;
}

