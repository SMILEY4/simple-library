import {ErrorResponse, handleRequest, mainSendCommand, sendRequest} from './messages';
import { LastOpenedLibraryEntry, LibraryMetadata } from '../commonModels';

export module GetLastOpenedLibrariesMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
        lastOpened: LastOpenedLibraryEntry[]
    }

    const CHANNEL: string = 'library.get.last_opened';

    export function request(ipc: Electron.IpcRenderer): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, {})
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module CreateLibraryMessage {

    export interface RequestPayload {
        targetDir: string,
        name: string
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'library.create';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module OpenLibraryMessage {

    export interface RequestPayload {
        path: string,
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'library.open';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}

export module CloseLibraryMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'library.close';

    export function request(ipc: Electron.IpcRenderer): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, {});
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module GetLibraryMetadataMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
        data: LibraryMetadata
    }

    const CHANNEL: string = 'library.get';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}