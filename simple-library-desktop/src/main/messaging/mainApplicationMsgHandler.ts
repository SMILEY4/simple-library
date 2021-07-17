import {ApplicationService} from "../service/applicationService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel
} from "../../common/messaging/channels/channels";

export class MainApplicationMsgHandler {

	private readonly appService: ApplicationService;
	private readonly windowService: WindowService;

	private readonly channelOpenConfig = new ConfigOpenChannel(mainIpcWrapper());
	private readonly channelGetExiftoolData = new ConfigGetExiftoolChannel(mainIpcWrapper());
	private readonly channelGetTheme = new ConfigGetThemeChannel(mainIpcWrapper());
	private readonly channelSetTheme = new ConfigSetThemeChannel(mainIpcWrapper());


	constructor(appService: ApplicationService, windowService: WindowService) {
		this.appService = appService;
		this.windowService = windowService;

		this.channelOpenConfig.on(() => {
			return this.appService.openConfigFile();
		});

		this.channelGetExiftoolData.on(() => {
			return Promise.resolve(this.appService.getExiftoolLocation())
				.then((location: string | null) => ({
					location: location,
					defined: location !== null
				}));
		});

		this.channelGetTheme.on(() => {
			return Promise.resolve(this.appService.getApplicationTheme());
		});

		this.channelSetTheme.on((theme) => {
			this.windowService.setApplicationTheme(theme);
			this.appService.setApplicationTheme(theme);
			return Promise.resolve();
		});
	}


	public init(): MainApplicationMsgHandler {
		this.channelOpenConfig.init();
		this.channelGetExiftoolData.init();
		this.channelGetTheme.init();
		this.channelSetTheme.init();
		return this;
	}

}
