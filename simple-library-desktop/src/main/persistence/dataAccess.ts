import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export default class DataAccess {

    database: Database | undefined;

    /**
     * "Opens" the database file at the given url (and creates if it necessary and specified)
     * @param url the url/path to the db-file
     * @param create whether to create a new db if the file does not exist
     * @return an error-string or undefined if successful
     */
    public openDatabase(url: string, create: boolean): string | undefined {
        this.closeDatabase();
        const mode: number = create ? (OPEN_CREATE | OPEN_READWRITE) : OPEN_READWRITE;
        let error: string | undefined = undefined;
        const db = new Database(url, mode, (err: any) => {
            error = err?.message;
        });
        if (error) {
            console.log('Error opening db "' + url + '": ' + error);
            return error;
        } else {
            this.database = db;
            console.log('Opened db: ' + url);
            return undefined;
        }
    }


    /**
     * Closes the currently open database
     */
    public closeDatabase() {
        if (this.database) {
            this.database.close();
            this.database = null;
            console.log("Closed current database");
        }
    }


    /**
     * Executes the given sql-command. Recommended for inserts, updates, deletes, ...
     * @param sql the sql-command
     * @return a promise that resolves with the "lastID" provided by the db
     */
    public executeRun(sql: string): Promise<number> {
        return this.executeSqlInPromise((resolve, reject) => {
            this.database.run(sql, function(error: Error | null, result: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }


    /**
     * Executes the given sql-query and returns all results. Recommended for selects with any amount of result-rows
     * @param sql the sql-query
     * @return a promise that resolves with an array of rows
     */
    public queryAll(sql: string): Promise<any[]> {
        return this.executeSqlInPromise((resolve, reject) => {
            this.database.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }


    private executeSqlInPromise(action: (resolve: any, reject: any) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.database) {
                action(resolve, reject);
            } else {
                reject('No database open');
            }
        });
    }

}
