import {
    Command,
    CommandHandler,
    handleRequest,
    mainSendCommand,
    rendererOnCommand,
    Request,
    RequestHandler,
    Response,
    sendRequest,
} from './messages';
import { ImportProcessData, ImportStatus } from '../../common/commonModels';


export module GetLastOpenedLibrariesMessage {

    const CHANNEL_GET_LAST_OPENED: string = 'libraries.last_opened';

    export function request(ipc: Electron.IpcRenderer): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_GET_LAST_OPENED,
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: () => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_GET_LAST_OPENED,
            action: () => action(),
        };
        handleRequest(ipc, handler);
    }

}


export module CreateLibraryMessage {

    const CHANNEL_CREATE_LIBRARY: string = 'library.create';

    export function request(ipc: Electron.IpcRenderer, path: string, name: string): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_CREATE_LIBRARY,
            payload: {
                path: path,
                name: name,
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (path: string, name: string) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_CREATE_LIBRARY,
            action: (payload) => action(payload.path, payload.name),
        };
        handleRequest(ipc, handler);
    }

}


export module OpenLibraryMessage {

    const CHANNEL_OPEN_LIBRARY: string = 'library.load';

    export function request(ipc: Electron.IpcRenderer, path: string): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_OPEN_LIBRARY,
            payload: {
                path: path,
                name: name,
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (path: string) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_OPEN_LIBRARY,
            action: (payload) => action(payload.path),
        };
        handleRequest(ipc, handler);
    }


}


export module CloseCurrentLibraryMessage {

    const CHANNEL_CLOSE_LIBRARY: string = 'library.close';

    export function request(ipc: Electron.IpcRenderer): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_CLOSE_LIBRARY,
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: () => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_CLOSE_LIBRARY,
            action: () => action(),
        };
        handleRequest(ipc, handler);
    }

}


export module GetLibraryMetadataMessage {

    const CHANNEL_GET_LIBRARY_METADATA: string = 'library.metadata';

    export function request(ipc: Electron.IpcRenderer): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_GET_LIBRARY_METADATA,
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: () => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_GET_LIBRARY_METADATA,
            action: () => action(),
        };
        handleRequest(ipc, handler);
    }

}

export module ImportFilesMessage {

    const CHANNEL_IMPORT_FILES: string = 'library.import_files';

    export function request(ipc: Electron.IpcRenderer, data: ImportProcessData): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_IMPORT_FILES,
            payload: {
                data: data,
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (data: ImportProcessData) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_IMPORT_FILES,
            action: (payload) => action(payload.data),
        };
        handleRequest(ipc, handler);
    }
}

export module ImportStatusUpdateCommand {

    const CHANNEL_IMPORT_STATUS_UPDATE: string = 'library.import_status_update';

    export function on(ipc: Electron.IpcRenderer, action: (status: ImportStatus) => void): void {
        const handler: CommandHandler = {
            channel: CHANNEL_IMPORT_STATUS_UPDATE,
            action: (payload) => action(payload),
        };
        rendererOnCommand(ipc, handler);
    }

    export function send(window: Electron.BrowserWindow, status: ImportStatus) {
        const command: Command = {
            channel: CHANNEL_IMPORT_STATUS_UPDATE,
            payload: status,
        };
        mainSendCommand(window, command);
    }

}

export module GetItemsMessage {

    const CHANNEL_GET_ITEMS: string = 'library.items.get';

    export function request(ipc: Electron.IpcRenderer, collectionId: number | undefined): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_GET_ITEMS,
            payload: {
                collectionId: collectionId,
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (collectionId: number | undefined) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_GET_ITEMS,
            action: (payload) => action(payload.collectionId),
        };
        handleRequest(ipc, handler);
    }

}


export module GetCollectionsMessage {

    const CHANNEL_GET_COLLECTIONS: string = 'library.collections.get';

    export function request(ipc: Electron.IpcRenderer, includeItemCount: boolean): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_GET_COLLECTIONS,
            payload: {
                includeItemCount: includeItemCount
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (includeItemCount:boolean) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_GET_COLLECTIONS,
            action: (payload) => action(payload.includeItemCount),
        };
        handleRequest(ipc, handler);
    }

}
