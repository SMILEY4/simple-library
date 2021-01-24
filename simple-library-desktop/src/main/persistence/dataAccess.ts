import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export default class DataAccess {

    /**
     * The currently open database or undefined
     */
    database: Database | undefined;


    /**
     * Opens the connection to the database at the given location. If a db is already open, it will be closed first.
     * @param url the url to the db-file
     * @param create whether to create a new file or just open the existing one
     * @return an error message or nothing
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
     * Closes the current database connection (only if it is open)
     */
    public closeDatabase() {
        if (this.database) {
            this.database.close();
            this.database = null;
            console.log("Closed current database")
        }
    }

    /**
     * Execute the given sql command without any result values (e.g. insert, create table)
     * @param sql the command to execute
     */
    public executeRun(sql: string): Promise<void> {
        return this.executeSqlInPromise((resolve, reject) => {
            this.database.run(sql, (err) => err ? reject(err) : resolve());
        });
    }

    /**
     * Execute the given sql query
     * @param sql the query to execute
     */
    public queryAll(sql: string): Promise<any> {
        return this.executeSqlInPromise((resolve, reject) => {
            this.database.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
        });
    }

    /**
     * Executes a given action. Wrapped inside a promise that is automatically rejected when the database is not open.
     * @param action the action to run
     */
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
