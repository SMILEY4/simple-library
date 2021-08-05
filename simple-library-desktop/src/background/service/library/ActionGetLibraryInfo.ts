import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {LibraryInformation} from "./libraryCommons";

/**
 * Get information / metadata about the current library
 */
export class ActionGetLibraryInfo {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}


	public perform(): Promise<LibraryInformation> {
		return this.queryInfo()
			.then((rows: any[]) => ({
				name: this.findName(rows),
				timestampCreated: this.findTimestampCreated(rows),
				timestampLastOpened: this.findTimestampLastOpened(rows)
			}));
	}


	private queryInfo(): Promise<any[]> {
		return this.dbAccess.queryAll(SQL.queryLibraryInfo());
	}


	private findName(rows: any[]): string {
		return rows.find(row => row.key === "library_name").value;
	}


	private findTimestampCreated(rows: any[]): number {
		return parseInt(rows.find((row: any) => row.key === "timestamp_created").value);
	}


	private findTimestampLastOpened(rows: any[]): number {
		return parseInt(rows.find((row: any) => row.key === "timestamp_last_opened").value);
	}

}