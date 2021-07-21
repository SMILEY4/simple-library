import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/ipcWrapper";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel,
	LibrariesGetLastOpenedChannel, LibraryCloseChannel,
	LibraryCreateChannel, LibraryGetMetadataChannel, LibraryOpenChannel,
	proxyChannel
} from "../../common/messaging/channels/channels";
import {BrowserWindow} from "electron";

export class MessageProxy {

	private readonly windowService: WindowService;

	constructor(windowService: WindowService, workerWindowProvider: () => BrowserWindow) {
		this.windowService = windowService;
		const ipcWrapper = mainIpcWrapper(workerWindowProvider);

		proxyChannel(ipcWrapper, ConfigOpenChannel.ID);
		proxyChannel(ipcWrapper, ConfigGetExiftoolChannel.ID);
		proxyChannel(ipcWrapper, ConfigGetThemeChannel.ID);
		proxyChannel(ipcWrapper, LibrariesGetLastOpenedChannel.ID);
		proxyChannel(ipcWrapper, LibraryGetMetadataChannel.ID);

		const channelSetTheme = new ConfigSetThemeChannel(ipcWrapper, "w");
		new ConfigSetThemeChannel(ipcWrapper, "r").on((theme) => {
			return channelSetTheme.send(theme)
				.then(() => this.windowService.setApplicationTheme(theme));
		});

		const channelLibraryCreate = new LibraryCreateChannel(ipcWrapper, "w");
		new LibraryCreateChannel(ipcWrapper, "r").on((payload) => {
			return channelLibraryCreate.send(payload)
				.then(() => this.windowService.switchToLargeWindow())
				.then(() => undefined);
		});

		const channelLibraryOpen = new LibraryOpenChannel(ipcWrapper, "w");
		new LibraryOpenChannel(ipcWrapper, "r").on((payload) => {
			return channelLibraryOpen.send(payload)
				.then(() => this.windowService.switchToLargeWindow())
				.then(() => undefined);
		});

		const channelLibraryClose = new LibraryCloseChannel(ipcWrapper, "w");
		new LibraryCloseChannel(ipcWrapper, "r").on((payload) => {
			return channelLibraryClose.send(payload)
				.then(() => this.windowService.switchToSmallWindow())
				.then(() => undefined);
		});

	}

}
