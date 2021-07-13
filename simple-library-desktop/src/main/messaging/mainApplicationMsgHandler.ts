import {ApplicationService} from "../service/applicationService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {AbstractApplicationMsgHandler, GetExiftoolDataPayload} from "../../common/messaging/applicationMsgHandler";

export class MainApplicationMsgHandler extends AbstractApplicationMsgHandler {

	private readonly appService: ApplicationService;
	private readonly windowService: WindowService;

	constructor(appService: ApplicationService, windowService: WindowService) {
		super(mainIpcWrapper());
		this.appService = appService;
		this.windowService = windowService;
	}

	protected openConfig(): Promise<void> {
		return this.appService.openConfigFile();
	}

	protected getExiftoolData(): Promise<GetExiftoolDataPayload> {
		return Promise.resolve(this.appService.getExiftoolLocation())
			.then((location: string | null) => ({
				location: location,
				defined: location !== null
			}));
	}

	protected getTheme(): Promise<"dark" | "light"> {
		return Promise.resolve(this.appService.getApplicationTheme());
	}

	protected setTheme(theme: "dark" | "light"): Promise<void> {
		this.windowService.setApplicationTheme(theme);
		this.appService.setApplicationTheme(theme);
		return Promise.resolve();
	}

}
