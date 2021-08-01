import path from "path";
import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {FileSystemWrapper} from "./fileSystemWrapper";
import {CollectionType} from "./collectionService";

export interface LibraryFileHandle {
	path: string,
	name: string,
}

export interface LibraryInformation {
	name: string,
	timestampCreated: number,
	timestampLastOpened: number,
}

export class LibraryService {

	private readonly dbAccess: DbAccess;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(dbAccess: DbAccess, fileSystemWrapper: FileSystemWrapper) {
		this.dbAccess = dbAccess;
		this.fsWrapper = fileSystemWrapper;
	}

	/**
	 * Create (and "open") a new library with the given name in the given directory.
	 */
	public create(name: string, targetDir: string, createDefaultCollection: boolean): Promise<LibraryFileHandle> {
		const filePath: string = LibraryService.toFilePath(targetDir, name);
		if (this.fsWrapper.existsFile(filePath)) {
			console.log("Could not create library. File already exists: " + filePath);
			return Promise.reject("File with the same name already exists (" + filePath + ").");
		} else {
			console.log("Creating new library: " + filePath);
			return this.dbAccess.setDatabasePath(filePath, true)
				.then(() => this.initLibrary(name, createDefaultCollection))
				.then(() => ({
					path: filePath,
					name: name
				}));
		}
	}

	/**
	 * "Opens" the library-file at the given location.
	 */
	public open(filePath: string): Promise<LibraryFileHandle> {
		if (this.fsWrapper.existsFile(filePath)) {
			console.log("Opening library: " + filePath);
			return this.dbAccess.setDatabasePath(filePath, false)
				.then(() => this.updateLibraryOpenedTimestamp())
				.then(() => this.getCurrentInformation())
				.then((libInfo: LibraryInformation) => ({
					path: filePath,
					name: libInfo.name
				}));
		} else {
			console.log("Could not open library: File does not exist (" + filePath + ")");
			return Promise.reject("Could not open library: File does not exist (" + filePath + ")");
		}
	}

	/**
	 * "Closes" the current library
	 */
	public closeCurrent(): Promise<void> {
		console.log("Closing library");
		this.dbAccess.clearDatabasePath();
		return Promise.resolve();
	}

	/**
	 * Get information / metadata about the current library
	 */
	public getCurrentInformation(): Promise<LibraryInformation> {
		return this.dbAccess.queryAll(SQL.queryLibraryInfo())
			.then((rows: any[]) => ({
				name: rows.find((row: any) => row.key === "library_name").value,
				timestampCreated: parseInt(rows.find((row: any) => row.key === "timestamp_created").value),
				timestampLastOpened: parseInt(rows.find((row: any) => row.key === "timestamp_last_opened").value)
			}));
	}

	private static toFilePath(dir: string, name: string): string {
		const filename: string = name
			.replace(/\s/g, "") // remove whitespaces
			.replace(/[^a-zA-Z0-9]/g, ""); // remove everything except characters or numbers
		return path.join(dir, filename + ".db");
	}

	private initLibrary(name: string, createDefaultCollection: boolean): Promise<void> {
		const queries = SQL.initializeNewLibrary(name, Date.now());
		if (createDefaultCollection) {
			queries.push(SQL.insertCollection("All Items", CollectionType.SMART, null, null));
		}
		return this.dbAccess.runMultipleSeq(queries).then();
	}

	private updateLibraryOpenedTimestamp(): Promise<void> {
		return this.dbAccess.run(SQL.updateLibraryInfoTimestampLastOpened(Date.now())).then();
	}

}