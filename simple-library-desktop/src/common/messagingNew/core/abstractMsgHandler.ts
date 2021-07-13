import {errorResponse, ErrorResponse} from "../../messaging/messages";
import {asChannel, asReplyChannel, IpcWrapper} from "./msgUtils";

interface HandlerEntry {
	id: string,
	handler: (payload: any) => any
}

export abstract class AbstractMsgHandler {

	private readonly entries: HandlerEntry[] = [];
	private readonly channelPrefix: string;
	private readonly ipcWrapper: IpcWrapper;

	protected constructor(channelPrefix: string, ipcWrapper: IpcWrapper) {
		this.channelPrefix = channelPrefix;
		this.ipcWrapper = ipcWrapper;
	}

	protected register<REQ, RES>(id: string, handler: (payload: REQ) => RES): void {
		this.entries.push({
			id: id,
			handler: handler
		});
	}

	public init<T>(): T {
		for (let entry of this.entries) {
			const channel: string = asChannel(this.channelPrefix, entry.id);
			switch (this.ipcWrapper.process) {
				case "main": {
					this.ipcWrapper.ipcMain.handle(channel, (event, arg) => {
						return this.handleRequestFromRender(channel, entry.handler, arg);
					});
					break;
				}
				case "renderer":
					this.ipcWrapper.ipcRenderer.on(channel, (event, arg) => {
						return this.handleRequestFromMain(channel, entry.handler, arg);
					});
					break;
			}
		}
		return this as unknown as T;
	}

	private handleRequestFromRender<REQ, RES>(
		channel: string,
		handler: (payload: REQ) => RES,
		payload: any
	): Promise<RES | ErrorResponse> {
		console.debug("[>main/" + channel + "] handle: " + JSON.stringify(payload));
		return Promise.resolve(handler(payload))
			.then((response => {
				console.debug("[>main/" + channel + "] respond: " + JSON.stringify(response));
				return response;
			}))
			.catch((err: any) => {
				const strError: string = (err.toString ? err.toString() : JSON.stringify(err));
				console.debug("[>main/" + channel + "] error: " + strError);
				return errorResponse(strError);
			});
	}

	private handleRequestFromMain<REQ, RES>(
		channel: string,
		handler: (payload: REQ) => RES,
		request: any
	): void {
		console.debug("[>render/" + channel + "] handle: " + JSON.stringify(request));
		Promise.resolve(handler(request.payload))
			.then((response => {
				console.debug("[>render/" + channel + "] respond: " + JSON.stringify(response));
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

	private sendReplyToMain<RES>(response: RES, requestId: string): void {
		console.debug("[>render/" + this.channelPrefix + "] send reply: " + JSON.stringify(response) + " reqId=" + requestId);
		this.ipcWrapper.ipcRenderer.send(asReplyChannel(this.channelPrefix), {
			requestId: requestId,
			payload: response
		});
	}

}