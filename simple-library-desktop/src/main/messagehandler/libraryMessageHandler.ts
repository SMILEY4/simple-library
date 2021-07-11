import {LastOpenedLibraryEntry, LibraryMetadata} from '../../common/commonModels';
import {LibraryService} from '../service/libraryService';
import {WindowService} from '../service/windowService';
import {AbstractLibraryMsgHandler} from "../../common/messagingNew/abstractLibraryMsgHandler";
import {mainIpcWrapper} from "../../common/messagingNew/msgUtils";

export class LibraryMessageHandler extends AbstractLibraryMsgHandler {

	appService: LibraryService;
	windowService: WindowService;

	constructor(appService: LibraryService, windowService: WindowService) {
		super(mainIpcWrapper());
		this.appService = appService;
		this.windowService = windowService;
	}

	protected getLastOpened(): Promise<LastOpenedLibraryEntry[]> {
		return this.appService.getLibrariesLastOpened()
	}

	protected createLibrary(targetDir: string, name: string): Promise<void> {
		return this.appService.createLibrary(targetDir, name)
			.then(() => this.windowService.switchToLargeWindow())
			.then();
	}

	protected openLibrary(path: string): Promise<void> {
		return this.appService.openLibrary(path)
			.then(() => this.windowService.switchToLargeWindow())
			.then();
	}

	protected closeLibrary(): Promise<void> {
		this.windowService.switchToSmallWindow();
		this.appService.closeCurrentLibrary();
		return Promise.resolve();
	}

	protected getMetadata(): Promise<LibraryMetadata> {
		return this.appService.getLibraryMetadata()
	}

}