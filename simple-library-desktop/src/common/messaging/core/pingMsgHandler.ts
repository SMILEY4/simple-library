import {AbstractMsgHandler} from "./abstractMsgHandler";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./msgUtils";

abstract class AbstractPingMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super("ping", ipcWrapper);
		this.register("do", (payload: any) => this.ping(payload.text))
	}

	protected abstract ping(text: string): Promise<string>;

}


export class MainPingMsgHandler extends AbstractPingMsgHandler {

	constructor() {
		super(mainIpcWrapper());
	}

	protected ping(text: string): Promise<string> {
		console.log("MAIN HANDLE PING", text)
		return Promise.reject("main(" + text + ")");
	}

}

export class RendererPingMsgHandler extends AbstractPingMsgHandler {

	constructor() {
		super(rendererIpcWrapper());
	}

	protected ping(text: string): Promise<string> {
		console.log("RENDER HANDLE PING", text)
		return Promise.reject("render(" + text + ")");
	}

}