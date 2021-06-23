import {ipcMain} from "electron";
import {errorResponse, ErrorResponse} from "../../common/messaging/messages";
import {ApplicationService} from "../service/applicationService";
import {OpenConfigFileMessage} from "../../common/messaging/messagesApplication";

export class ApplicationMessageHandler {

	appService: ApplicationService;

	constructor(appService: ApplicationService) {
		this.appService = appService;
	}

	public initialize(): void {
		OpenConfigFileMessage.handle(ipcMain, payload => this.handleOpenConfigFile(payload));
	}

	private async handleOpenConfigFile(payload: OpenConfigFileMessage.RequestPayload): Promise<OpenConfigFileMessage.ResponsePayload | ErrorResponse> {
		return this.appService.openConfigFile()
			.then(() => ({}))
			.catch(err => errorResponse(err))
	}

}


