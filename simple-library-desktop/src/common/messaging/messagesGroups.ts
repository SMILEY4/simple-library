import { Collection, Group } from '../commonModels';
import { ErrorResponse, handleRequest, sendRequest } from './messages';


export module GetGroupsMessage {

    export interface RequestPayload {
        includeCollections: boolean,
        includeItemCount: boolean
    }

    export interface ResponsePayload {
        groups: Group[]
    }

    const CHANNEL: string = 'group.get';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}

export module CreateGroupMessage {

    export interface RequestPayload {
        name: string
    }

    export interface ResponsePayload {
        group: Group
    }

    const CHANNEL: string = 'group.create';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}