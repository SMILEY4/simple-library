import { ImportProcessData, ImportResult, ImportStatus, ItemData } from '../commonModels';
import { ErrorResponse, handleRequest, mainSendCommand, rendererOnCommand, sendRequest } from './messages';


export module GetItemsMessage {

    export interface RequestPayload {
        collectionId: number
    }

    export interface ResponsePayload {
        items: ItemData[]
    }

    const CHANNEL: string = 'item.get';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}

export module DeleteItemsMessage {

    export interface RequestPayload {
        itemIds: number[]
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'item.delete';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module ImportItemsMessage {

    export interface RequestPayload {
        data: ImportProcessData
    }

    export interface ResponsePayload {
        result: ImportResult
    }

    const CHANNEL: string = 'item.import';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module ImportStatusUpdateCommand {

    export interface CommandPayload {
        status: ImportStatus
    }


    const CHANNEL: string = 'item.import.status_update';

    export function on(ipc: Electron.IpcRenderer, action: (status: ImportStatus) => void): void {
        rendererOnCommand<CommandPayload>(ipc, CHANNEL, (payload: CommandPayload) => action(payload.status));
    }

    export function send(window: Electron.BrowserWindow, status: ImportStatus) {
        mainSendCommand<CommandPayload>(window, CHANNEL, { status: status });
    }

}