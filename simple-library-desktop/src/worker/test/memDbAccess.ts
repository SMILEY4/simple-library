import {DbAccess} from "../persistence/dbAcces";
import {Database, OPEN_CREATE, OPEN_READWRITE} from "sqlite3";

export class MemDbAccess extends DbAccess {

	private db: Database | null = null;

	public setDatabasePath(path: string, create: boolean): Promise<void> {
		if (this.getDatabaseUrl() !== path) {
			return new Promise((resolve, reject) => {
				if (this.db) {
					this.db.close();
				}
				this.db = new Database(":memory:", (OPEN_CREATE | OPEN_READWRITE), (error: any) => {
					error ? reject(error.message) : resolve();
				});
			})
				.then(() => this.db.get("PRAGMA foreign_keys = ON"))
				.then(() => this.setUrlUnsafe(path));
		} else {
			return Promise.resolve()
				.then(() => this.setUrlUnsafe(path));
		}
	}

	public clearDatabasePath(): void {
		if (this.db) {
			this.db.close(() => this.db = null);
			this.setUrlUnsafe(null);
		}
	}

	public getDatabase(): Promise<Database> {
		if (this.db) {
			return Promise.resolve(this.db);
		} else {
			return Promise.reject("No db-url given.");
		}
	}
}