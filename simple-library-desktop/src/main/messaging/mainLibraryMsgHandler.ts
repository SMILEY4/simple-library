import {LibraryService} from "../service/libraryService";
import {WindowService} from "../service/windowService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../../common/commonModels";
import {AbstractLibraryMsgHandler} from "../../common/messaging/libraryMsgHandler";

export class MainLibraryMsgHandler extends AbstractLibraryMsgHandler {

	private readonly appService: LibraryService;
	private readonly windowService: WindowService;

	constructor(appService: LibraryService, windowService: WindowService) {
		super(mainIpcWrapper());
		this.appService = appService;
		this.windowService = windowService;
	}

	protected getLastOpened(): Promise<LastOpenedLibraryEntry[]> {
		return this.appService.getLibrariesLastOpened();
	}

	protected create(targetDir: string, name: string): Promise<void> {
		return this.appService.createLibrary(targetDir, name)
			.then(() => {
				this.windowService.switchToLargeWindow();
			});
	}

	protected open(path: string): Promise<void> {
		return this.appService.openLibrary(path)
			.then(() => {
				this.windowService.switchToLargeWindow();
			});
	}

	protected close(): Promise<void> {
		this.windowService.switchToSmallWindow();
		this.appService.closeCurrentLibrary();
		return Promise.resolve();
	}

	protected getMetadata(): Promise<LibraryMetadata> {
		return this.appService.getLibraryMetadata();
	}

}
