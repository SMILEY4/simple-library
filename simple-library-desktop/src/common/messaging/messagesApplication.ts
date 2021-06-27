import {ErrorResponse, handleRequest, sendRequest} from './messages';


export module OpenConfigFileMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'application.open_config_file';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module GetExiftoolDataMessage {

    export interface RequestPayload {
    }

    export interface ResponsePayload {
        location: string | null;
        defined: boolean;
    }

    const CHANNEL: string = 'application.exiftool.get';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}