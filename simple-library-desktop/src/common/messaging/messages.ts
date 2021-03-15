// COMMANDS: "send-and-forget", renderer-to-main or main-to-renderer

export function rendererSendCommand<T>(ipc: Electron.IpcRenderer, channel: string, payload: T) {
    console.debug("[" + channel + "] sending command (r->m): " + JSON.stringify(payload));
    ipc.send(channel, payload);
}

export function mainOnCommand<T>(ipc: Electron.IpcMain, channel: string, handler: (payload: T) => void) {
    ipc.on(channel, (event, payload) => {
        console.debug("[" + channel + "] receive command (r->m): " + JSON.stringify(payload));
        handler(payload);
    });
}

export function mainSendCommand<T>(window: Electron.BrowserWindow, channel: string, payload: T) {
    console.debug("[" + channel + "] sending command (m->r): " + JSON.stringify(payload));
    window.webContents.send(channel, payload);
}

export function rendererOnCommand<T>(ipc: Electron.IpcRenderer, channel: string, handler: (payload: T) => void) {
    ipc.on(channel, (event, payload) => {
        console.debug("[" + channel + "] receive command (m->r): " + JSON.stringify(payload));
        handler(payload);
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
        console.debug('[' + channel + '] receive response: ' + JSON.stringify(response));
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
