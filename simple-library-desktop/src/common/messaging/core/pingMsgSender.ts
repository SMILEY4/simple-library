import {AbstractMsgSender} from "./abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./msgUtils";
import {BrowserWindow} from "electron";

abstract class AbstractPingMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super("ping", ipcWrapper);
	}

	public ping(text: string): Promise<string> {
		return this.send("do", {text: text});
	}

}

export class MainPingMsgSender extends AbstractPingMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}

export class RenderPingMsgSender extends AbstractPingMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
