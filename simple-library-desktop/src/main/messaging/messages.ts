const CHANNEL_CREATE_LIBRARY: string = 'library.create';

export function requestCreateLibrary(ipc: Electron.IpcRenderer, path: string, name: string): Promise<Response> {
    const request: Request = {
        channel: CHANNEL_CREATE_LIBRARY,
        payload: {
            path: path,
            name: name,
        },
    };
    return sendRequest(ipc, request);
}

export function onRequestCreateLibrary(ipc: Electron.IpcMain, action: (path: string, name: string) => Promise<Response>) {
    const handler: RequestHandler = {
        channel: CHANNEL_CREATE_LIBRARY,
        action: (payload) => action(payload.path, payload.name),
    };
    handleRequest(ipc, handler);
}


const CHANNEL_OPEN_LIBRARY: string = 'library.load';

export function requestOpenLibrary(ipc: Electron.IpcRenderer, path: string): Promise<Response> {
    const request: Request = {
        channel: CHANNEL_OPEN_LIBRARY,
        payload: {
            path: path,
            name: name,
        },
    };
    return sendRequest(ipc, request);
}

export function onRequestOpenLibrary(ipc: Electron.IpcMain, action: (path: string) => Promise<Response>) {
    const handler: RequestHandler = {
        channel: CHANNEL_OPEN_LIBRARY,
        action: (payload) => action(payload.path),
    };
    handleRequest(ipc, handler);
}


const CHANNEL_GET_LIBRARY_METADATA: string = 'library.metadata';

export function requestLibraryMetadata(ipc: Electron.IpcRenderer): Promise<Response> {
    const request: Request = {
        channel: CHANNEL_GET_LIBRARY_METADATA,
    };
    return sendRequest(ipc, request);
}

export function onRequestLibraryMetadata(ipc: Electron.IpcMain, action: () => Promise<Response>) {
    const handler: RequestHandler = {
        channel: CHANNEL_GET_LIBRARY_METADATA,
        action: () => action(),
    };
    handleRequest(ipc, handler);
}

const CHANNEL_GET_LAST_OPENED: string = 'last_opened';

export function requestLastOpened(ipc: Electron.IpcRenderer): Promise<Response> {
    const request: Request = {
        channel: CHANNEL_GET_LAST_OPENED,
    };
    return sendRequest(ipc, request);
}

export function onRequestLastOpened(ipc: Electron.IpcMain, action: () => Promise<Response>) {
    const handler: RequestHandler = {
        channel: CHANNEL_GET_LAST_OPENED,
        action: () => action(),
    };
    handleRequest(ipc, handler);
}


// COMMON

// COMMANDS: "send-and-forget", renderer-to-main or main-to-renderer

export interface Command {
    channel: string,
    payload?: any
}

export interface CommandHandler {
    channel: string,
    action: (payload?: any) => void
}

function rendererSendCommand(ipc: Electron.IpcRenderer, command: Command) {
    ipc.send('command.' + command.channel, command.payload);
}

function mainOnCommand(ipc: Electron.IpcMain, handler: CommandHandler) {
    ipc.on('command.' + handler.channel, handler.action);

}

function mainSendCommand(window: Electron.BrowserWindow, command: Command) {
    window.webContents.send('command.' + command.channel, command.payload);
}

function rendererOnCommand(ipc: Electron.IpcRenderer, handler: CommandHandler) {
    ipc.on('command' + handler.channel, handler.action);
}

// REQUESTS: send and wait for returned data, renderer-to-main (and back)

export interface Request {
    channel: string,
    payload?: any
}

export interface RequestHandler {
    channel: string,
    action: (payload?: any) => Promise<Response>
}

export enum ResponseStatus {
    SUCCESS = 'success',
    FAILED = 'failed'
}

export interface Response {
    status: ResponseStatus,
    body?: any,
}

export function successResponse(body?: any): Response {
    return {
        status: ResponseStatus.SUCCESS,
        body: body,
    };
}

export function failedResponse(body?: any): Response {
    return {
        status: ResponseStatus.FAILED,
        body: body,
    };
}


function sendRequest(ipc: Electron.IpcRenderer, request: Request): Promise<Response> {
    console.debug('[' + request.channel + '] sending request: ' + JSON.stringify(request));
    return ipc.invoke('request.' + request.channel, request.payload)
        .then(response => {
            console.log('[' + request.channel + '] send response: ' + JSON.stringify(response));
            if (response && response.status === ResponseStatus.SUCCESS) {
                return response;
            } else {
                return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
            }
        });
}

function handleRequest(ipc: Electron.IpcMain, handler: RequestHandler) {
    ipc.handle('request.' + handler.channel, (event, arg) => {
        console.debug('[' + handler.channel + '] handling request: ' + JSON.stringify(arg));
        return handler.action(arg);
    });
}


// TODO SWITCH TO WELCOME (rework)


export function requestSwitchToWelcomeScreen(ipc: Electron.IpcRenderer) {
    ipc.send('screens.switch.request.welcome'); // todo: remove / replace
}

export function onRequestSwitchToWelcomeScreen(ipc: Electron.IpcMain, action: () => void) {
    ipc.on('screens.switch.request.welcome', action);// todo: remove / replace
}

export function switchedToWelcomeScreen(window: Electron.BrowserWindow) {
    window.webContents.send('screens.switch.done.welcome');// todo: remove / replace
}

export function onSwitchedToWelcomeScreen(ipc: Electron.IpcRenderer, action: () => void) {
    ipc.on('screens.switch.done.welcome', action);// todo: remove / replace
}
