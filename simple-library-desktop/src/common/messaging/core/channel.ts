import {ERROR_RESPONSE_MARKER, errorResponse, getBrowserWindow, IpcWrapper} from "./msgUtils";

export class Channel<SEND, RECEIVE> {

	private readonly logPayload: boolean;
	private readonly id: string;
	private readonly ipcWrapper: IpcWrapper;

	private readonly noopHandler: (payload: SEND) => RECEIVE | Promise<RECEIVE> = () => undefined;
	private handler: (payload: SEND) => RECEIVE | Promise<RECEIVE> = this.noopHandler;


	constructor(id: string, ipcWrapper: IpcWrapper, logPayload?: boolean) {
		this.id = id;
		this.ipcWrapper = ipcWrapper;
		this.logPayload = logPayload !== false;
		this.setupListener();
	}

	private setupListener() {
		switch (this.ipcWrapper.process) {
			case "main": {
				this.ipcWrapper.ipcMain.answerRenderer(this.id, (payload: SEND) => this.handleRequest(payload));
				break;
			}
			case "renderer": {
				this.ipcWrapper.ipcRenderer.answerMain(this.id, (payload: SEND) => this.handleRequest(payload));
				break;
			}
		}
	}

	public send(payload: SEND): Promise<RECEIVE> {
		console.debug("[" + this.ipcWrapper.process + "/" + this.id + ">]: send", +this.logPayload ? payload : "<payload>");
		switch (this.ipcWrapper.process) {
			case "main": {
				return this.ipcWrapper.ipcMain.callRenderer(getBrowserWindow(this.ipcWrapper), this.id, payload)
					.then((response: any) => this.handleResponse(response));
			}
			case "renderer": {
				return this.ipcWrapper.ipcRenderer.callMain(this.id, payload)
					.then((response: any) => this.handleResponse(response));
			}
			default: {
				return Promise.reject("Unexpected process: " + this.ipcWrapper.process);
			}
		}
	}

	public sendAndForget(payload: SEND): Promise<void> {
		return this.send(payload).then();
	}

	public on<T extends Channel<SEND, RECEIVE>>(handler: (payload: SEND) => RECEIVE | Promise<RECEIVE>): T {
		this.handler = (!!handler) ? handler : this.noopHandler;
		return (this as unknown) as T;
	}

	private handleRequest(payload: any): Promise<any> {
		console.debug("[>" + this.ipcWrapper.process + "/" + this.id + "]: handle", +this.logPayload ? payload : "<payload>");
		return Promise.resolve(this.handler(payload))
			.then((response: any) => {
				console.debug("[>" + this.ipcWrapper.process + "/" + this.id + "]: answer", +this.logPayload ? response : "<payload>");
				return response;
			})
			.catch((err: any) => {
				const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
				console.debug("[>" + this.ipcWrapper.process + "/" + this.id + "]: answer error", +strError);
				return errorResponse(strError);
			});
	}

	private handleResponse(response: any): Promise<any> {
		console.debug("[" + this.ipcWrapper.process + "/" + this.id + ">]: response", +this.logPayload ? response : "<payload>");
		if (Channel.isErrorResponse(response)) {
			return Channel.rejectWithErrorResponse(response);
		} else {
			return Promise.resolve(response);
		}
	}

	private static isErrorResponse(response: any): boolean {
		return response && response.status && response.status === ERROR_RESPONSE_MARKER;
	}

	private static rejectWithErrorResponse(response: any): Promise<any> {
		return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
	}

}