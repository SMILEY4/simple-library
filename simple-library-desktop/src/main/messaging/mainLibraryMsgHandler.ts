import {LibraryService} from "../service/libraryService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {
	LibrariesGetLastOpenedChannel,
	LibraryCloseChannel,
	LibraryCreateChannel,
	LibraryGetMetadataChannel,
	LibraryOpenChannel
} from "../../common/messaging/channels/channels";

export class MainLibraryMsgHandler {

	private readonly appService: LibraryService;
	private readonly windowService: WindowService;

	private readonly channelGetLastOpened = new LibrariesGetLastOpenedChannel(mainIpcWrapper(), "r");
	private readonly channelCreate = new LibraryCreateChannel(mainIpcWrapper(), "r");
	private readonly channelOpen = new LibraryOpenChannel(mainIpcWrapper(), "r");
	private readonly channelClose = new LibraryCloseChannel(mainIpcWrapper(), "r");
	private readonly channelGetMetadata = new LibraryGetMetadataChannel((mainIpcWrapper()), "r");


	constructor(appService: LibraryService, windowService: WindowService) {
		this.appService = appService;
		this.windowService = windowService;

		this.channelGetLastOpened.on(() => {
			return this.appService.getLibrariesLastOpened();
		});

		this.channelCreate.on((payload) => {
			return this.appService.createLibrary(payload.targetDir, payload.name)
				.then(() => {
					this.windowService.switchToLargeWindow();
				});
		});

		this.channelOpen.on((path: string) => {
			return this.appService.openLibrary(path)
				.then(() => {
					this.windowService.switchToLargeWindow();
				});
		});

		this.channelClose.on(() => {
			this.windowService.switchToSmallWindow();
			this.appService.closeCurrentLibrary();
			return Promise.resolve();
		});

		this.channelGetMetadata.on(() => {
			return this.appService.getLibraryMetadata();
		});

	}

}
