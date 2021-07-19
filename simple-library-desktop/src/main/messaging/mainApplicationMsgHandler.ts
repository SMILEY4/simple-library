import {ApplicationService} from "../service/applicationService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel,
	proxyChannel
} from "../../common/messaging/channels/channels";
import {BrowserWindow} from "electron";

export class MainApplicationMsgHandler {

	private readonly windowService: WindowService;

	constructor(windowService: WindowService, workerWindowProvider: () => BrowserWindow) {
		this.windowService = windowService;

		const ipcWrapper = mainIpcWrapper(workerWindowProvider);

		proxyChannel(ipcWrapper, ConfigOpenChannel.ID, "r", "w");
		proxyChannel(ipcWrapper, ConfigGetExiftoolChannel.ID, "r", "w");
		proxyChannel(ipcWrapper, ConfigGetThemeChannel.ID, "r", "w");

		const channelSetTheme = new ConfigSetThemeChannel(ipcWrapper, "w");
		new ConfigSetThemeChannel(ipcWrapper, "r").on((theme) => {
			return channelSetTheme.send(theme)
				.then(() => this.windowService.setApplicationTheme(theme));
		});
	}

}
