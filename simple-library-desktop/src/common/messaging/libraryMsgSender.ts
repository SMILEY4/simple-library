import {BrowserWindow} from "electron";
import {AbstractMsgSender} from "./core/abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {LibraryMsgConstants} from "./libraryMsgHandler";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../commonModels";

abstract class AbstractLibraryMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(LibraryMsgConstants.PREFIX, ipcWrapper);
	}

	public getLastOpened(): Promise<LastOpenedLibraryEntry[]> {
		return this.send(LibraryMsgConstants.GET_LAST_OPENED);
	}

	public create(targetDir: string, name: string): Promise<void> {
		return this.send(LibraryMsgConstants.CREATE, {
			targetDir: targetDir,
			name: name
		});
	}

	public open(path: string): Promise<void> {
		return this.send(LibraryMsgConstants.OPEN, {
			path: path
		});
	}

	public close(): Promise<void> {
		return this.send(LibraryMsgConstants.CLOSE);
	}

	public getMetadata(): Promise<LibraryMetadata> {
		return this.send(LibraryMsgConstants.GET_METADATA);
	}

}


export class MainLibraryMsgSender extends AbstractLibraryMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}


export class RenderLibraryMsgSender extends AbstractLibraryMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
