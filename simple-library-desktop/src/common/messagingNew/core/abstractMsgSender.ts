import {asChannel, asReplyChannel, IpcWrapper} from "./msgUtils";
import {ERROR_RESPONSE_MARKER} from "../messaging/messages";
import {RequestStash} from "./requestStash";
import {Deferred} from "../deferredPromise";

export abstract class AbstractMsgSender {

	private readonly channelPrefix: string;
	private readonly ipcWrapper: IpcWrapper;
	private readonly requestStash: RequestStash<Deferred<any>> = new RequestStash<Deferred<any>>();

	protected constructor(channelPrefix: string, ipcWrapper: IpcWrapper) {
		this.channelPrefix = channelPrefix;
		this.ipcWrapper = ipcWrapper;
		if (this.ipcWrapper.process === "main") {
			const replyChannel: string = asReplyChannel(this.channelPrefix);
			this.ipcWrapper.ipcMain.on(replyChannel, (event, args) => this.handleReply(args));
		}
	}

	protected send<PAYLOAD>(id: string, payload?: PAYLOAD): Promise<any> {
		const channel: string = asChannel(this.channelPrefix, id);
		switch (this.ipcWrapper.process) {
			case "main": {
				return this.sendMessageToRenderer(channel, payload);
			}
			case "renderer":
				return this.sendMessageToMain(channel, payload);
		}

		return Promise.resolve(null);
	}

	private sendMessageToRenderer<PAYLOAD>(channel: string, payload?: PAYLOAD): Promise<any> {
		const deferred: Deferred<any> = new Deferred<any>();
		const requestId: string = this.requestStash.stash(deferred);
		console.debug("[main/" + channel + ">] send: " + JSON.stringify(payload) + " reqId=" + requestId);
		this.ipcWrapper.browserWindow.webContents.send(channel, {
			requestId: requestId,
			payload: payload
		})
		return deferred.getPromise();
	}

	private sendMessageToMain<PAYLOAD>(channel: string, payload?: PAYLOAD): Promise<any> {
		console.debug("[render/" + channel + ">] send: " + JSON.stringify(payload));
		return this.ipcWrapper.ipcRenderer.invoke(channel, payload)
			.then((response: any) => this.handleResponseFromMain(channel, response))
	}

	private handleResponseFromMain<PAYLOAD, RES>(channel: string, response: any): Promise<RES> {
		console.debug("[" + this.ipcWrapper.process + "/" + channel + ">] response: " + JSON.stringify(response));
		if (response && response.status && response.status === ERROR_RESPONSE_MARKER) {
			return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
		} else {
			return response;
		}
	}

	private handleReply(args: any): void {
		if (!!args.requestId) {
			console.debug("[main/reply." + this.channelPrefix + ">] handle reply: " + JSON.stringify(args.pa) + " reqId=" + args.requestId);
			const deferred: Deferred<any> = this.requestStash.retrieve(args.requestId);
			const payload: any = args.payload;
			if (payload && payload.status && payload.status === ERROR_RESPONSE_MARKER) {
				deferred.reject((payload && payload.body) ? payload.body : JSON.stringify(payload));
			} else {
				deferred.resolve(payload);
			}
		}
	}

}