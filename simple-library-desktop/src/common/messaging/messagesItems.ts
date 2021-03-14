import { ImportProcessData, ImportResult, ImportStatus, ItemData } from '../commonModels';
import {
    Command,
    CommandHandler,
    ErrorResponse,
    handleRequest,
    mainSendCommand,
    rendererOnCommand,
    sendRequest,
} from './messages';


export module GetItemsMessage {

    export interface RequestPayload {
        collectionId: number | undefined
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


export module GetItemCountMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
        count: number
    }

    const CHANNEL: string = 'item.count';

    export function request(ipc: Electron.IpcRenderer): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, {});
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


export module ImportStatusUpdateCommand { // todo: command =/= message => refactor commands

    const CHANNEL: string = 'item.import.status_update';

    export function on(ipc: Electron.IpcRenderer, action: (status: ImportStatus) => void): void {
        const handler: CommandHandler = {
            channel: CHANNEL,
            action: (payload) => action(payload),
        };
        rendererOnCommand(ipc, handler);
    }

    export function send(window: Electron.BrowserWindow, status: ImportStatus) {
        const command: Command = {
            channel: CHANNEL,
            payload: status,
        };
        mainSendCommand(window, command);
    }

}