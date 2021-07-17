import {rendererIpcWrapper} from "../../common/messaging/core/msgUtils";
import {LastOpenedLibraryEntry, LibraryMetadata} from "../../common/commonModels";
import {AbstractLibraryMsgHandler} from "../../common/messaging/libraryMsgHandler";
import {DbAccess} from "../persistence/dbAcces";
import {ConfigAccess} from "../persistence/configAccess";

export class WorkerLibraryMsgHandler extends AbstractLibraryMsgHandler {

	private readonly dbAccess: DbAccess;
	private readonly configAccess: ConfigAccess;

	constructor(dbAccess: DbAccess, configAccess: ConfigAccess) {
		super(rendererIpcWrapper());
		this.dbAccess = dbAccess;
		this.configAccess = configAccess;
	}

	protected getLastOpened(): Promise<LastOpenedLibraryEntry[]> {
		return Promise.resolve(this.configAccess.getLastOpened());
	}

	protected create(targetDir: string, name: string): Promise<void> {
		this.configAccess.addLastOpened("todo-name", "todo-path");
		return Promise.resolve();
	}

	protected open(path: string): Promise<void> {
		this.configAccess.addLastOpened("todo-name", "todo-path");
		return Promise.resolve();
	}

	protected close(): Promise<void> {
		return Promise.resolve();
	}

	protected getMetadata(): Promise<LibraryMetadata> {
		return Promise.resolve(null);
	}

}
