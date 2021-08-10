import {DbAccess} from "../../persistence/dbAcces";

/**
 * "Closes" the current library
 */
export class ActionCloseLibrary {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(): void {
		console.log("Closing library");
		this.dbAccess.clearDatabasePath();
	}

}