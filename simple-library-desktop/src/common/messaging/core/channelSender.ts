import {asReplyChannel, ERROR_RESPONSE_MARKER, IpcWrapper} from "./msgUtils";
import {Deferred} from "../../deferredPromise";
import {RequestStash} from "./requestStash";


export class ChannelSender<SEND, RECEIVE> {

	private readonly logPayload: boolean;
	private readonly id: string;
	private readonly requestStash: RequestStash<Deferred<any>> = new RequestStash<Deferred<any>>();
	private ipcWrapper: IpcWrapper;


	constructor(id: string, ipcWrapper: IpcWrapper | null, logPayload?: boolean) {
		this.id = id;
		this.ipcWrapper = ipcWrapper;
		this.logPayload = logPayload !== false;
	}

	public setIpcWrapper(ipcWrapper: IpcWrapper) {
		this.ipcWrapper = ipcWrapper;
	}

	public init(): void {
		if (this.ipcWrapper.process === "main") {
			const replyChannel: string = asReplyChannel(this.id);
			this.ipcWrapper.ipcMain.on(replyChannel, (event, args) => this.handleReply(args));
		}
	}

	public send(payload: SEND): Promise<RECEIVE> {
		switch (this.ipcWrapper.process) {
			case "main": {
				return this.sendMessageToRenderer(this.id, payload);
			}
			case "renderer": {
				return this.sendMessageToMain(this.id, payload);
			}
		}
	}

	public sendAndForget(payload: SEND): Promise<void> {
		switch (this.ipcWrapper.process) {
			case "main": {
				return Promise.resolve().then(() => this.sendCommandToRenderer(this.id, payload));
			}
			case "renderer": {
				return Promise.resolve().then(() => this.sendCommandToMain(this.id, payload));
			}
		}
	}

	private sendMessageToRenderer(channel: string, payload?: SEND): Promise<RECEIVE> {
		if (!this.ipcWrapper.browserWindow) {
			throw "Cant send message to renderer: No BrowserWindow provided.";
		} else {
			const deferred: Deferred<any> = new Deferred<any>();
			const requestId: string = this.requestStash.stash(deferred);
			console.debug("[main/" + channel + ">] send: " + this.getLogPayload(payload) + " reqId=" + requestId);
			this.ipcWrapper.browserWindow.webContents.send(channel, {
				requestId: requestId,
				payload: payload
			});
			return deferred.getPromise();
		}
	}

	private sendCommandToRenderer(channel: string, payload?: SEND): void {
		if (!this.ipcWrapper.browserWindow) {
			throw "Cant send message to renderer: No BrowserWindow provided.";
		} else {
			console.debug("[main/" + channel + ">] send (cmd): " + this.getLogPayload(payload));
			this.ipcWrapper.browserWindow.webContents.send(channel, {payload: payload});
		}
	}

	private sendMessageToMain(channel: string, payload?: SEND): Promise<RECEIVE> {
		console.debug("[render/" + channel + ">] send: " + this.getLogPayload(payload));
		return this.ipcWrapper.ipcRenderer.invoke(channel, payload)
			.then((response: any) => this.handleResponseFromMain(channel, response));
	}

	private sendCommandToMain(channel: string, payload?: SEND): void {
		console.debug("[render/" + channel + ">] send (cmd): " + this.getLogPayload(payload));
		this.ipcWrapper.ipcRenderer.send(channel, payload);
	}

	private handleResponseFromMain(channel: string, response: any): Promise<RECEIVE> {
		console.debug("[" + this.ipcWrapper.process + "/" + channel + ">] response: " + this.getLogPayload(response));
		if (response && response.status && response.status === ERROR_RESPONSE_MARKER) {
			return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
		} else {
			return response;
		}
	}

	private handleReply(args: any): void {
		if (!!args.requestId) {
			console.debug("[main/reply." + this.id + ">] handle reply: " + this.getLogPayload(args.payload) + " reqId=" + args.requestId);
			const deferred: Deferred<any> = this.requestStash.retrieve(args.requestId);
			const payload: any = args.payload;
			if (payload && payload.status && payload.status === ERROR_RESPONSE_MARKER) {
				deferred.reject((payload && payload.body) ? payload.body : JSON.stringify(payload));
			} else {
				deferred.resolve(payload);
			}
		}
	}

	private getLogPayload(payload: any): string {
		if(this.logPayload) {
			return JSON.stringify(payload)
		} else {
			return "-shortened-"
		}
	}
	
}