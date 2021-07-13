import {BrowserWindow} from "electron";
import {ApplicationMsgConstants, GetExiftoolDataPayload} from "./applicationMsgHandler";
import {AbstractMsgSender} from "./core/abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";

abstract class AbstractApplicationMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(ApplicationMsgConstants.PREFIX, ipcWrapper);
	}

	public openConfig(): Promise<void> {
		return this.send(ApplicationMsgConstants.OPEN_CONFIG);
	}

	public getExiftoolData(): Promise<GetExiftoolDataPayload> {
		return this.send(ApplicationMsgConstants.GET_EXIFTOOL);
	}

	public getTheme(): Promise<"dark" | "light"> {
		return this.send(ApplicationMsgConstants.GET_THEME);
	}

	public setTheme(theme: "dark" | "light"): Promise<void> {
		return this.send(ApplicationMsgConstants.SET_THEME, {
			theme: theme
		});
	}

}


export class MainApplicationMsgSender extends AbstractApplicationMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}


export class RenderApplicationMsgSender extends AbstractApplicationMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
