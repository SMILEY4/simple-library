import {ipcMain} from "electron";
import {errorResponse, ErrorResponse} from "../../common/messaging/messages";
import {ApplicationService} from "../service/applicationService";
import {GetExiftoolDataMessage, OpenConfigFileMessage} from "../../common/messaging/messagesApplication";
import {startAsyncWithValue} from "../../common/AsyncCommon";

export class ApplicationMessageHandler {

	appService: ApplicationService;

	constructor(appService: ApplicationService) {
		this.appService = appService;
	}

	public initialize(): void {
		OpenConfigFileMessage.handle(ipcMain, payload => this.handleOpenConfigFile(payload));
		GetExiftoolDataMessage.handle(ipcMain, payload => this.handleGetExiftoolData(payload));
	}

	private async handleOpenConfigFile(payload: OpenConfigFileMessage.RequestPayload): Promise<OpenConfigFileMessage.ResponsePayload | ErrorResponse> {
		return this.appService.openConfigFile()
			.then(() => ({}))
			.catch(err => errorResponse(err))
	}

	private async handleGetExiftoolData(payload: GetExiftoolDataMessage.RequestPayload): Promise<GetExiftoolDataMessage.ResponsePayload | ErrorResponse> {
		return startAsyncWithValue(this.appService.getExiftoolLocation())
			.then((location: string | null) => ({
				location: location,
				defined: location !== null
			}))
			.catch(err => errorResponse(err))
	}

}


