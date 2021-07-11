import {errorResponse, ErrorResponse} from "../messaging/messages";
import {asChannel, IpcWrapper} from "./msgUtils";

export abstract class AbstractMsgHandler {

	channelPrefix: string;
	ipcWrapper: IpcWrapper;

	protected constructor(channelPrefix: string, ipcWrapper: IpcWrapper) {
		this.channelPrefix = channelPrefix;
		this.ipcWrapper = ipcWrapper;
	}

	protected register<REQ, RES>(id: string, handler: (payload: REQ) => RES): void {
		const channel: string = asChannel(this.channelPrefix, id);
		switch (this.ipcWrapper.process) {
			case "main": {
				this.ipcWrapper.ipcMain.handle(channel, (event, arg) => {
					return this.handleRequest("main", channel, handler, arg)
				});
				break;
			}
			case "renderer":
				this.ipcWrapper.ipcRenderer.on(channel, (event, arg) => {
					return this.handleRequest("render", channel, handler, arg);

					// todo: ipcRenderer.on can not return anything
					//  -> send a "reply" event to main with request-id from payload-wrapper
				})
				break;
		}
	}

	private handleRequest<REQ, RES>(
		proc: "main" | "render",
		channel: string,
		handler: (payload: REQ) => RES,
		payload: any
	): Promise<RES | ErrorResponse> {
		console.debug("[>" + proc + "/" + channel + "] handle: " + JSON.stringify(payload));
		return Promise.resolve(handler(payload))
			.then((response => {
				console.debug("[>" + proc + "/" + channel + "] respond: " + JSON.stringify(response));
				return response;
			}))
			.catch((err: any) => {
				console.debug("[>" + proc + "/" + channel + "] error: " + JSON.stringify(err));
				return errorResponse(err);
			})
	}

}