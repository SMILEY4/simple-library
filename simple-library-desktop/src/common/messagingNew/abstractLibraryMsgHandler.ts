import {AbstractMsgHandler} from "./abstractMsgHandler";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../commonModels";
import {IpcWrapper} from "./msgUtils";

export abstract class AbstractLibraryMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super("library", ipcWrapper);
		this.register("last_opened", () => this.getLastOpened())
		this.register("create", (payload: any) => this.createLibrary(payload.targetDir, payload.name))
		this.register("open", (payload: any) => this.openLibrary(payload.path))
		this.register("close", () => this.closeLibrary())
		this.register("metadata", () => this.getMetadata())
	}

	protected abstract getLastOpened(): Promise<LastOpenedLibraryEntry[]>;

	protected abstract createLibrary(targetDir: string, name: string): Promise<void>;

	protected abstract openLibrary(path: string): Promise<void>;

	protected abstract closeLibrary(): Promise<void>;

	protected abstract getMetadata(): Promise<LibraryMetadata>;

}