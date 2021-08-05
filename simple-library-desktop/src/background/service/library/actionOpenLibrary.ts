import {DbAccess} from "../../persistence/dbAcces";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {SQL} from "../../persistence/sqlHandler";
import {ActionGetLibraryInfo} from "./ActionGetLibraryInfo";
import {LibraryFileHandle, LibraryInformation} from "./libraryCommons";

/**
 * "Opens" the library-file at the given location.
 */
export class ActionOpenLibrary {

	private readonly dbAccess: DbAccess;
	private readonly fsWrapper: FileSystemWrapper;
	private readonly actionGetInfo: ActionGetLibraryInfo;


	constructor(dbAccess: DbAccess, fsWrapper: FileSystemWrapper, actionGetInfo: ActionGetLibraryInfo) {
		this.dbAccess = dbAccess;
		this.fsWrapper = fsWrapper;
		this.actionGetInfo = actionGetInfo;
	}


	public perform(filepath: string): Promise<LibraryFileHandle> {
		if (this.doesFileExist(filepath)) {
			return this.open(filepath)
				.then(() => this.updateOpenedTimestamp())
				.then(() => this.resultOpened(filepath));
		} else {
			return this.resultFileDoesNotExist(filepath);
		}
	}


	private doesFileExist(filepath: string): boolean {
		return this.fsWrapper.existsFile(filepath);
	}


	private open(filepath: string): Promise<any> {
		console.log("Opening library: " + filepath);
		return this.dbAccess.setDatabasePath(filepath, false);
	}


	private updateOpenedTimestamp(): Promise<any> {
		return this.dbAccess.run(SQL.updateLibraryInfoTimestampLastOpened(Date.now()));
	}


	private resultFileDoesNotExist(filepath: string): Promise<LibraryFileHandle> {
		console.log("Could not open library: File does not exist (" + filepath + ")");
		return Promise.reject("Could not open library: File does not exist (" + filepath + ")");
	}


	private resultOpened(filepath: string): Promise<LibraryFileHandle> {
		return this.actionGetInfo.perform()
			.then((info: LibraryInformation) => ({
				path: filepath,
				name: info.name
			}));
	}

}