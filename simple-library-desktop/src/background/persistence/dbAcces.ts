import {Database} from "sqlite3";

const sqlite3 = require('sqlite3').verbose();

export class DbAccess {

	/**
	 * Holding the url of the current database or null.
	 */
	private url: string | null = null;

	/**
	 * Point this db-access to the db at the given path. Create a new db if the "create"-flag is set.
	 */
	public setDatabasePath(path: string, create: boolean): Promise<void> {
		this.url = path;
		if (create) {
			return this.createDbFile(path);
		} else {
			return Promise.resolve();
		}
	}

	protected setUrlUnsafe(url: string) {
		this.url = url;
	}

	/**
	 * Clears the current pointer to the database-file.
	 */
	public clearDatabasePath(): void {
		this.url = null;
	}

	/**
	 * Get the current url of the database.
	 */
	public getDatabaseUrl(): string | null {
		return this.url;
	}

	/**
	 * Run the given sql-command and return the last-id on success
	 */
	public run(sql: string, database?: Database): Promise<null | number> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => this.executeRun(db, sql));
	}

	/**
	 * Run the given sql-commands in parallel and return an array containing the last-ids or null (order is preserved).
	 */
	public runMultiple(arrSql: string[], database?: Database): Promise<(number | null)[]> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => Promise.all(arrSql.map((sql: string) => this.executeRun(db, sql).catch(() => null))));
	}

	/**
	 * Run the given sql-commands sequentially and return an array containing the last-ids or null (order is preserved).
	 */
	public runMultipleSeq(arrSql: string[], database?: Database): Promise<(number | null)[]> {
		return (database ? Promise.resolve(database) : this.getDatabase()).then(async (db: Database) => {
			const results: (number | null)[] = [];
			for (let sqlStmt of arrSql) {
					results.push(await this.executeRun(db, sqlStmt).catch(err => {
						console.log("Error during seq-run of stmt: ", sqlStmt, " => ", err);
						return null;
					}));
			}
			return results;
		});
	}

	/**
	 * Run the given sql-query and return a single row on success
	 */
	public querySingle(sql: string, database?: Database): Promise<any | null> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => this.executeQuerySingle(db, sql));
	}

	/**
	 * Run the given sql-queries in parallel and return an array containing the rows or null (order is preserved).
	 */
	public querySingleMultiple(arrSql: string[], database?: Database): Promise<(any | null)[]> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => Promise.all(arrSql.map((sql: string) => this.executeQuerySingle(db, sql).catch(() => null))));
	}

	/**
	 * Run the given sql-query and return all rows on success
	 */
	public queryAll(sql: string, database?: Database): Promise<any[]> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => this.executeQueryAll(db, sql));
	}

	/**
	 * Run the given sql-queries in parallel and return an array containing the row-arrays or null (order is preserved).
	 */
	public queryAllMultiple(arrSql: string[], database?: Database): Promise<(any[] | null)[]> {
		return (database ? Promise.resolve(database) : this.getDatabase())
			.then(db => Promise.all(arrSql.map((sql: string) => this.executeQueryAll(db, sql).catch(() => null))));
	}

	/**
	 * Open and return a connection to the database.
	 */
	public getDatabase(): Promise<Database> {
		if (this.url) {
			let db: Database | null = null;
			return new Promise((resolve, reject) => {
				db = new sqlite3.Database(this.url, sqlite3.OPEN_READWRITE, (error: any) => {
					error ? reject(error.message) : resolve();
				});
			}).then(() => db);
		} else {
			return Promise.reject("No db-url given.");
		}
	}

	private createDbFile(url: string): Promise<void> {
		let db: Database | null = null;
		return new Promise((resolve, reject) => {
			db = new sqlite3.Database(url, (sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE), (error: any) => {
				error ? reject(error.message) : resolve();
			});
		}).then(() => db.get("PRAGMA foreign_keys = ON")).then();
	}

	private executeRun(database: Database, sql: string): Promise<number> {
		return new Promise((resolve, reject) => {
			database.run(sql, function (error: Error | null) {
				error ? reject(error) : resolve(this.lastID);
			});
		});
	}

	private executeQuerySingle(database: Database, sql: string): Promise<any | null> {
		return new Promise((resolve, reject) => {
			database.get(sql, (err, row) => err ? reject(err) : resolve(row ? row : null));
		});
	}

	private executeQueryAll(database: Database, sql: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			database.all(sql, (err, rows) => err ? reject(err) : resolve(rows ? rows : []));
		});
	}

}