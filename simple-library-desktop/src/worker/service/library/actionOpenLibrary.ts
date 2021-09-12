import {FileSystemWrapper} from "../fileSystemWrapper";
import {ActionGetLibraryInfo} from "./ActionGetLibraryInfo";
import {LibraryFileHandle, LibraryInformation} from "./libraryCommons";
import {DataRepository} from "../dataRepository";

/**
 * "Opens" the library-file at the given location.
 */
export class ActionOpenLibrary {

	private readonly repository: DataRepository;
	private readonly fsWrapper: FileSystemWrapper;
	private readonly actionGetInfo: ActionGetLibraryInfo;


	constructor(repository: DataRepository, fsWrapper: FileSystemWrapper, actionGetInfo: ActionGetLibraryInfo) {
		this.repository = repository;
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
		return this.repository.open(filepath, false);
	}


	private updateOpenedTimestamp(): Promise<any> {
		return this.repository.updateLibraryLastOpened(Date.now());
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
