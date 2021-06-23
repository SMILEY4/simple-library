import {WindowService} from "../service/windowService";
import {ipcMain} from "electron";
import {GetApplicationTheme, SetApplicationTheme} from "../../common/messaging/messagesWindow";
import {errorResponse, ErrorResponse} from "../../common/messaging/messages";
import {ApplicationService} from "../service/applicationService";
import {startAsync, startAsyncWithValue} from "../../common/AsyncCommon";

export class WindowMessageHandler {

	windowService: WindowService;
	appService: ApplicationService;

	constructor(windowService: WindowService, appService: ApplicationService) {
		this.windowService = windowService;
		this.appService = appService;
	}

	public initialize(): void {
		SetApplicationTheme.handle(ipcMain, payload => this.handleSetApplicationTheme(payload));
		GetApplicationTheme.handle(ipcMain, payload => this.handleGetApplicationTheme(payload));
	}

	private async handleSetApplicationTheme(payload: SetApplicationTheme.RequestPayload): Promise<SetApplicationTheme.ResponsePayload | ErrorResponse> {
		return startAsync()
			.then(() => {
				this.windowService.setApplicationTheme(payload.theme);
				this.appService.setApplicationTheme(payload.theme)
				return {};
			})
			.catch(err => errorResponse(err));
	}

	private async handleGetApplicationTheme(payload: GetApplicationTheme.RequestPayload): Promise<GetApplicationTheme.ResponsePayload | ErrorResponse> {
		return startAsyncWithValue(this.appService.getApplicationTheme())
			.then((theme: "dark" | "light") => ({theme: theme}))
			.catch(err => errorResponse(err));
	}

}


