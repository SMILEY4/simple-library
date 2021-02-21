import { handleRequest, Request, RequestHandler, Response, sendRequest } from './messages';


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

    export function request(ipc: Electron.IpcRenderer, files: string[], fileAction: string, targetDir: string | undefined): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_IMPORT_FILES,
            payload: {
                files: files,
                fileAction: fileAction,
                targetDir: targetDir
            },
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: (files: string[], fileAction: string, targetDir: string | undefined) => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_IMPORT_FILES,
            action: (payload) => action(payload.files, payload.fileAction, payload.targetDir),
        };
        handleRequest(ipc, handler);
    }
}

export module GetItemsMessage {

    const CHANNEL_GET_ITEMS: string = 'library.items.get';

    export function request(ipc: Electron.IpcRenderer): Promise<Response> {
        const request: Request = {
            channel: CHANNEL_GET_ITEMS,
            payload: {},
        };
        return sendRequest(ipc, request);
    }

    export function handle(ipc: Electron.IpcMain, action: () => Promise<Response>) {
        const handler: RequestHandler = {
            channel: CHANNEL_GET_ITEMS,
            action: () => action(),
        };
        handleRequest(ipc, handler);
    }

}

