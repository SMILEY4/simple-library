export function requestCreateLibrary(ipc: Electron.IpcRenderer, path: string, name: string): Promise<Response> {
    const request: Request = {
        channel: 'library.create',
        payload: {
            path: path,
            name: name,
        },
    };
    return sendRequest(ipc, request);
}

export function onRequestCreateLibrary(ipc: Electron.IpcMain, action: (path: string, name: string) => Promise<Response>) {
    const handler: RequestHandler = {
        channel: 'library.create',
        action: (payload) => action(payload.path, payload.name),
    };
    handleRequest(ipc, handler);
}


export function requestLibraryMetadata(ipc: Electron.IpcRenderer): Promise<Response> {
    const request: Request = {
        channel: 'library.metadata',
    };
    return sendRequest(ipc, request);
}

export function onRequestLibraryMetadata(ipc: Electron.IpcMain, action: () => Promise<Response>) {
    const handler: RequestHandler = {
        channel: 'library.metadata',
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
