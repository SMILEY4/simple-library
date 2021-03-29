import { Group } from '../commonModels';
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
        name: string,
        parentGroupId: number | null
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

export module DeleteGroupMessage {

    export interface RequestPayload {
        groupId: number,
        deleteChildren: boolean
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'group.delete';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module RenameGroupMessage {

    export interface RequestPayload {
        groupId: number,
        newName: string
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'group.rename';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module MoveGroupMessage {

    export interface RequestPayload {
        groupId: number,
        targetGroupId: number | null
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'group.move';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}