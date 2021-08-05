import {DbAccess} from "../../persistence/dbAcces";
import path from "path";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {SQL} from "../../persistence/sqlHandler";
import {LibraryFileHandle} from "./libraryCommons";
import {CollectionType} from "../collection/collectionCommons";

/**
 * Create (and "open") a new library with the given name in the given directory.
 */
export class ActionCreateLibrary {

	private readonly dbAccess: DbAccess;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(dbAccess: DbAccess, fsWrapper: FileSystemWrapper) {
		this.dbAccess = dbAccess;
		this.fsWrapper = fsWrapper;
	}


	public perform(name: string, targetDir: string, createDefaultCollection: boolean): Promise<LibraryFileHandle> {
		const filepath: string = this.toFilePath(targetDir, name);
		if (this.doesFileExist(filepath)) {
			return this.resultFileAlreadyExists(filepath);
		} else {
			return this.create(filepath, name)
				.then(() => this.initLibrary(name, createDefaultCollection))
				.then(() => this.resultCreated(filepath, name));
		}
	}


	private toFilePath(dir: string, name: string): string {
		const filename: string = name
			// remove whitespaces
			.replace(/\s/g, "")
			// remove everything except characters or numbers
			.replace(/[^a-zA-Z0-9]/g, "");
		return path.join(dir, filename + ".db");
	}


	private doesFileExist(filepath: string): boolean {
		return this.fsWrapper.existsFile(filepath);
	}


	private create(filepath: string, name: string): Promise<any> {
		console.log("Creating new library: " + filepath);
		return this.dbAccess.setDatabasePath(filepath, true);
	}


	private initLibrary(name: string, createDefaultCollection: boolean): Promise<any> {
		const queries = SQL.initializeNewLibrary(name, Date.now());
		if (createDefaultCollection) {
			queries.push(SQL.insertCollection("All Items", CollectionType.SMART, null, null));
		}
		return this.dbAccess.runMultipleSeq(queries);
	}


	private resultFileAlreadyExists(filepath: string): Promise<LibraryFileHandle> {
		console.log("Could not create library. File already exists: " + filepath);
		return Promise.reject("File with the same name already exists (" + filepath + ").");
	}


	private resultCreated(filepath: string, name: string) {
		return {
			path: filepath,
			name: name
		};
	}

}