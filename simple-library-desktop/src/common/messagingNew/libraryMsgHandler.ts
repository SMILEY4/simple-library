import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper, mainIpcWrapper} from "./core/msgUtils";
import {LibraryService} from "../../main/service/LibraryService";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../commonModels";
import {WindowService} from "../../main/service/windowService";

export module LibraryMsgConstants {
	export const PREFIX: string = "library";
	export const GET_LAST_OPENED: string = "get-last-opened";
	export const CREATE: string = "create";
	export const OPEN: string = "open";
	export const CLOSE: string = "close";
	export const GET_METADATA: string = "get-metadata";
}


abstract class AbstractLibraryMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(LibraryMsgConstants.PREFIX, ipcWrapper);
		this.register(LibraryMsgConstants.GET_LAST_OPENED, () => this.getLastOpened());
		this.register(LibraryMsgConstants.CREATE, (payload: any) => this.create(payload.targetDir, payload.name));
		this.register(LibraryMsgConstants.OPEN, (payload: any) => this.open(payload.path));
		this.register(LibraryMsgConstants.CLOSE, () => this.close());
		this.register(LibraryMsgConstants.GET_METADATA, () => this.getMetadata());
	}

	protected abstract getLastOpened(): Promise<LastOpenedLibraryEntry[]>;

	protected abstract create(targetDir: string, name: string): Promise<void>;

	protected abstract open(path: string): Promise<void>;

	protected abstract close(): Promise<void>;

	protected abstract getMetadata(): Promise<LibraryMetadata>;

}


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
				this.windowService.switchToLargeWindow()
			})
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
