import {WindowService} from "../service/windowService";
import {ipcMain} from "electron";
import {SetApplicationTheme} from "../../common/messaging/messagesWindow";
import {ErrorResponse} from "../../common/messaging/messages";

export class WindowMessageHandler {

	windowService: WindowService;

	constructor(windowService: WindowService) {
		this.windowService = windowService;
	}

	public initialize(): void {
		SetApplicationTheme.handle(ipcMain, payload => this.handleSetApplicationTheme(payload));
	}

	private async handleSetApplicationTheme(payload: SetApplicationTheme.RequestPayload): Promise<SetApplicationTheme.ResponsePayload | ErrorResponse> {
		this.windowService.setApplicationTheme(payload.theme);
		return {};
	}

}


