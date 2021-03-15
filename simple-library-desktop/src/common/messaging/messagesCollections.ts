import { Collection } from '../commonModels';
import { ErrorResponse, handleRequest, sendRequest } from './messages';


export module GetAllCollectionsMessage {

    export interface RequestPayload {
        includeItemCount: boolean
    }

    export interface ResponsePayload {
        collections: Collection[]
    }

    const CHANNEL: string = 'collection.get_all';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module CreateCollectionMessage {

    export interface RequestPayload {
        name: string
    }

    export interface ResponsePayload {
        collection: Collection
    }

    const CHANNEL: string = 'collection.create';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module DeleteCollectionMessage {

    export interface RequestPayload {
        collectionId: number
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'collection.delete';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module RenameCollectionMessage {

    export interface RequestPayload {
        collectionId: number,
        newName: string
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'collection.rename';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}


export module MoveItemsToCollectionsMessage {

    export interface RequestPayload {
        sourceCollectionId: number | undefined,
        targetCollectionId: number,
        itemIds: number[],
        copy: boolean
    }

    export interface ResponsePayload {
    }

    const CHANNEL: string = 'collections.move_items';

    export function request(ipc: Electron.IpcRenderer, payload: RequestPayload): Promise<ResponsePayload> {
        return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, payload);
    }

    export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
        handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
    }

}