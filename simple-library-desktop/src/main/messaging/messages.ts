export function requestCreateLibrary(ipc: Electron.IpcRenderer, path: string, name: string): Promise<Response> {
    const request: Request = {
        channel: 'library.create',
        payload: {
            path: path,
            name: name,
        },
    };
    return new Promise(function(resolve, reject) {
        rendererSendRequest(ipc, request)
            .then((response => {
                if (isErrorResponse(response)) {
                    const failedResponse = <ErrorResponse>response;
                    reject(failedResponse);
                } else {
                    const successResponse = <SuccessResponse>response;
                    resolve(successResponse.payload);
                }
            }));
    });
}

export function onRequestCreateLibrary(ipc: Electron.IpcMain, action: (path: string, name: string) => Response) {
    const handler: RequestHandler = {
        channel: 'library.create',
        action: (payload) => action(payload.path, payload.name),
    };
    mainOnRequest(ipc, handler);
}


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

// COMMON

// commands: "send-and-forget", renderer-to-main or main-to-renderer

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

// requests: send and wait for returned data, renderer-to-main (and back)

export interface Request {
    channel: string,
    payload?: any
}

export interface RequestHandler {
    channel: string,
    action: (payload?: any) => Response
}

export interface SuccessResponse {
    payload?: any,
}

export interface ErrorResponse {
    reason: string
    payload?: any,
}

export type Response = SuccessResponse | ErrorResponse

function isErrorResponse(response: Response): boolean {
    const obj: any = response;
    return obj.reason !== undefined;
}


function rendererSendRequest(ipc: Electron.IpcRenderer, request: Request): Promise<Response> {
    return ipc.invoke('request.' + request.channel, request.payload);
}

function mainOnRequest(ipc: Electron.IpcMain, handler: RequestHandler) {
    ipc.handle('request.' + handler.channel, async (event, arg) => {
        return handler.action(arg);
    });
}


