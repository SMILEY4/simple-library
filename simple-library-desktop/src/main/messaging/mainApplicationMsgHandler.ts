import {ApplicationService} from "../service/applicationService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel
} from "../../common/messaging/channels/channels";
import {BrowserWindow} from "electron";

export class MainApplicationMsgHandler {

	private readonly appService: ApplicationService;
	private readonly windowService: WindowService;

	private readonly channelOpenConfig: ConfigOpenChannel;
	private readonly channelGetExiftoolData: ConfigGetExiftoolChannel;
	private readonly channelGetTheme: ConfigGetThemeChannel;
	private readonly channelSetTheme: ConfigSetThemeChannel;


	constructor(appService: ApplicationService, windowService: WindowService, workerWindowProvider: () => BrowserWindow) {
		this.appService = appService;
		this.windowService = windowService;

		const ipcWrapper = mainIpcWrapper(workerWindowProvider);

		this.channelOpenConfig = new ConfigOpenChannel(ipcWrapper).on(() => {
			return this.channelOpenConfig.send();
		});

		this.channelGetExiftoolData = new ConfigGetExiftoolChannel(ipcWrapper).on(() => {
			return Promise.resolve(this.appService.getExiftoolLocation())
				.then((location: string | null) => ({
					location: location,
					defined: location !== null
				}));
		});

		this.channelGetTheme = new ConfigGetThemeChannel(ipcWrapper).on(() => {
			return Promise.resolve(this.appService.getApplicationTheme());
		});

		this.channelSetTheme = new ConfigSetThemeChannel(ipcWrapper).on((theme) => {
			this.windowService.setApplicationTheme(theme);
			this.appService.setApplicationTheme(theme);
			return Promise.resolve();
		});

	}

}
