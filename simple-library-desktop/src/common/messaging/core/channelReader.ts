import {asReplyChannel, errorResponse, ErrorResponse, IpcWrapper} from "../../messaging/core/msgUtils";


export class ChannelReader<SEND, RECEIVE> {

	private readonly NO_OP_HANDLER: (payload: RECEIVE) => SEND | null = () => undefined;

	private readonly logPayload: boolean;
	private readonly id: string;
	private ipcWrapper: IpcWrapper;
	private initialized: boolean = false;
	private handler: ((payload: RECEIVE) => SEND | Promise<SEND>) = this.NO_OP_HANDLER;


	constructor(id: string, ipcWrapper: IpcWrapper | null, logPayload?: boolean) {
		this.id = id;
		this.ipcWrapper = ipcWrapper;
		this.logPayload = logPayload !== false;
	}

	public setIpcWrapper(ipcWrapper: IpcWrapper) {
		this.ipcWrapper = ipcWrapper;
	}

	public init(): void {
		if(this.handler !== this.NO_OP_HANDLER) {
			switch (this.ipcWrapper.process) {
				case "main": {
					this.ipcWrapper.ipcMain.handle(this.id, (event, arg) => {
						return this.handleRequestFromRender(this.id, this.handler, arg);
					});
					break;
				}
				case "renderer":
					this.ipcWrapper.ipcRenderer.on(this.id, (event, arg) => {
						return this.handleRequestFromMain(this.id, this.handler, arg);
					});
					break;
			}
			this.initialized = true;
		}
	}

	public setHandler(handler: undefined | null | ((payload: RECEIVE) => SEND | Promise<SEND>)): void {
		if (handler) {
			this.handler = handler;
		} else {
			this.handler = this.NO_OP_HANDLER;
		}
	}

	private handleRequestFromRender(channel: string, handler: (payload: RECEIVE) => SEND | Promise<SEND>, payload: any): Promise<SEND | ErrorResponse> {
		console.debug("[>main/" + channel + "] handle: " + this.getLogPayload(payload));
		return Promise.resolve(handler(payload))
			.then((response => {
				console.debug("[>main/" + channel + "] respond: " + this.getLogPayload(response));
				return response;
			}))
			.catch((err: any) => {
				const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
				console.debug("[>main/" + channel + "] error: " + strError);
				return errorResponse(strError);
			});
	}

	private handleRequestFromMain(channel: string, handler: (payload: RECEIVE) => SEND | Promise<SEND>, request: any): void {
		console.debug("[>render/" + channel + "] handle: " + this.getLogPayload(request));
		Promise.resolve(handler(request.payload))
			.then((response => {
				console.debug("[>render/" + channel + "] respond: " + this.getLogPayload(response));
				return response;
			}))
			.catch((err: any) => {
				const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
				console.debug("[>render/" + channel + "] error: " + strError);
				return errorResponse(strError);
			})
			.then(response => {
				if (request.requestId) {
					this.sendReplyToMain(response, request.requestId);
				}
			});
	}

	private sendReplyToMain(response: SEND | ErrorResponse, requestId: string): void {
		console.debug("[>render/" + this.id + "] send reply: " + this.getLogPayload(response) + " reqId=" + requestId);
		this.ipcWrapper.ipcRenderer.send(asReplyChannel(this.id), {
			requestId: requestId,
			payload: response
		});
	}

	private getLogPayload(payload: any): string {
		if(this.logPayload) {
			return JSON.stringify(payload)
		} else {
			return "-shortened-"
		}
	}

}