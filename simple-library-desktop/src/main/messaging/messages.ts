

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

export function rendererSendCommand(ipc: Electron.IpcRenderer, command: Command) {
    ipc.send('command.' + command.channel, command.payload);
}

export function mainOnCommand(ipc: Electron.IpcMain, handler: CommandHandler) {
    ipc.on('command.' + handler.channel, handler.action);

}

export function mainSendCommand(window: Electron.BrowserWindow, command: Command) {
    window.webContents.send('command.' + command.channel, command.payload);
}

export function rendererOnCommand(ipc: Electron.IpcRenderer, handler: CommandHandler) {
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


export function sendRequest(ipc: Electron.IpcRenderer, request: Request): Promise<Response> {
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

export function handleRequest(ipc: Electron.IpcMain, handler: RequestHandler) {
    ipc.handle('request.' + handler.channel, (event, arg) => {
        console.debug('[' + handler.channel + '] handling request: ' + JSON.stringify(arg));
        return handler.action(arg);
    });
}
