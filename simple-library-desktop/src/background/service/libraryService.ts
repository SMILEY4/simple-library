import path from "path";
import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {Database} from "sqlite3";

const fs = require("fs");

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

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	/**
	 * Create (and "open") a new library with the given name in the given directory.
	 */
	public createLibrary(name: string, targetDir: string): Promise<LibraryFileHandle> {
		const filePath: string = LibraryService.toFilePath(targetDir, name);
		if (fs.existsSync(filePath)) {
			console.error("Could not create library. File already exists: " + filePath);
			return Promise.reject("File with the same name already exists (" + filePath + ").");
		} else {
			console.log("Creating new library: " + filePath);
			return this.dbAccess.setDatabasePath(filePath, true)
				.then(() => this.initLibrary(name))
				.then(() => ({
					path: filePath,
					name: name
				}));
		}
	}

	/**
	 * "Opens" the library-file at the given location.
	 */
	public openLibrary(filePath: string): Promise<LibraryFileHandle> {
		if (fs.existsSync(filePath)) {
			console.log("Opening library: " + filePath);
			return this.dbAccess.setDatabasePath(filePath, false)
				.then(() => this.updateLibraryOpenedTimestamp())
				.then(() => this.getLibraryInformation())
				.then((libInfo: LibraryInformation) => ({
					path: filePath,
					name: libInfo.name
				}));
		} else {
			console.error("Could not open library: File does not exist (" + filePath + ")");
			return Promise.reject("Could not open library: File does not exist (" + filePath + ")");
		}
	}

	/**
	 * "Closes" the current library
	 */
	public closeLibrary(): Promise<void> {
		console.log("Closing library");
		this.dbAccess.clearDatabasePath();
		return Promise.resolve();
	}

	/**
	 * Get information / metadata about the current library
	 */
	public getLibraryInformation(): Promise<LibraryInformation> {
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

	private initLibrary(name: string): Promise<void> {
		return this.dbAccess.getDatabase().then(async (db: Database) => {
			for (let sqlStmt of SQL.initializeNewLibrary(name, Date.now())) {
				await this.dbAccess.run(sqlStmt, db);
			}
		});
	}

	private updateLibraryOpenedTimestamp(): Promise<void> {
		return this.dbAccess.run(SQL.updateLibraryInfoTimestampLastOpened(Date.now())).then();
	}

}