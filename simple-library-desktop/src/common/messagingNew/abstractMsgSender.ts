import {asChannel, IpcWrapper} from "./msgUtils";
import {ERROR_RESPONSE_MARKER} from "../messaging/messages";

export abstract class AbstractMsgSender {

	channelPrefix: string;
	ipcWrapper: IpcWrapper;
	pendingRequests: Promise<any>[] = [];

	protected constructor(channelPrefix: string, ipcWrapper: IpcWrapper) {
		this.channelPrefix = channelPrefix;
		this.ipcWrapper = ipcWrapper;
	}

	protected send<PAYLOAD>(id: string, payload?: PAYLOAD): Promise<any> {
		const channel: string = asChannel(this.channelPrefix, id);
		switch (this.ipcWrapper.process) {
			case "main": {
				console.debug("[main/" + channel + ">] send: " + JSON.stringify(payload));
				const promise: Promise<any> = this.stashPromise("todo");
				this.ipcWrapper.browserWindow.webContents.send(channel, payload);
				// todo: webContents.send does not return a response
				//  =>  register an event-handler to "reply"-channel
				//  -> create + stash promise with request id
				//  -> wrap payload -> add request-id
				//  -> send event + return unresolved promise
				//  -> when reply-handler receives event -> find promise by id -> resolve promise
				return promise;
			}
			case "renderer":
				console.debug("[render/" + channel + ">] send: " + JSON.stringify(payload));
				return this.ipcWrapper.ipcRenderer.invoke(channel, payload)
					.then((response: any) => this.handleResponse("render", channel, response))
		}

		return Promise.resolve(null);
	}


	private stashPromise(requestId: string): Promise<any> {
		const promise: Promise<any> = new Promise((resolve,reject) => {});
		this.pendingRequests.push(promise) // push into map -> key = requestId
		return promise;
	}

	private resolvePromise(requestId: string, payload: any): void {
		// todo:
		//   - get + remove promise from stash by id
		//	 - resolve promise with payload
	}


	private handleResponse<PAYLOAD, RES>(proc: "main" | "render", channel: string, response: any): Promise<RES> {
		console.debug("[" + this.ipcWrapper.process + "/" + channel + ">] response: " + JSON.stringify(response));
		if (response && response.status && response.status === ERROR_RESPONSE_MARKER) {
			return Promise.reject((response && response.body) ? response.body : JSON.stringify(response));
		} else {
			return response;
		}
	}

}