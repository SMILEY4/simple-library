import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper} from "./core/msgUtils";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../commonModels";

export module LibraryMsgConstants {
	export const PREFIX: string = "library";
	export const GET_LAST_OPENED: string = "get-last-opened";
	export const CREATE: string = "create";
	export const OPEN: string = "open";
	export const CLOSE: string = "close";
	export const GET_METADATA: string = "get-metadata";
}


export abstract class AbstractLibraryMsgHandler extends AbstractMsgHandler {

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

