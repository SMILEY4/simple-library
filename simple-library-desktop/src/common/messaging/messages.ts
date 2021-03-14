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
    console.debug("sending command (renderer): " + JSON.stringify(command));
    ipc.send('command.' + command.channel, command.payload);
}

export function mainOnCommand(ipc: Electron.IpcMain, handler: CommandHandler) {
    ipc.on('command.' + handler.channel, handler.action);

}

export function mainSendCommand(window: Electron.BrowserWindow, command: Command) {
    console.debug("sending command (main): " + JSON.stringify(command));
    window.webContents.send('command.' + command.channel, command.payload);
}

export function rendererOnCommand(ipc: Electron.IpcRenderer, handler: CommandHandler) {
    ipc.on('command.' + handler.channel, (event, payload) => {
        handler.action(payload);
    });
}

// REQUESTS: send and "wait" for returned data, renderer-to-main (and back)

const ERROR_RESPONSE_MARKER: string = "error-response";

export interface ErrorResponse {
    status: string,
    body?: any,
}

export function errorResponse(body?: any): ErrorResponse {
    return {
        status: ERROR_RESPONSE_MARKER,
        body: body,
    };
}


export function sendRequest<REQ, RES>(ipc: Electron.IpcRenderer, channel: string, requestPayload: REQ): Promise<RES> {
    console.debug('[' + channel + '] sending request: ' + JSON.stringify(requestPayload));
    return ipc.invoke(channel, requestPayload).then(response => {
        console.log('[' + channel + '] send response: ' + JSON.stringify(response));
        if (response && response.status && response.status === ERROR_RESPONSE_MARKER) {
            return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
        } else {
            return response;
        }
    });
}

export function handleRequest<REQ, RES>(ipc: Electron.IpcMain, channel: string, action: (requestPayload: REQ) => Promise<RES | ErrorResponse>) {
    ipc.handle(channel, (event, arg) => {
        console.debug('[' + channel + '] handling request: ' + JSON.stringify(arg));
        return action(arg);
    });
}
