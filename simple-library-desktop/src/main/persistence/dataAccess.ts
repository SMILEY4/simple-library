import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import { errorResult, Result, successResult } from '../utils/result';

export default class DataAccess {

    /**
     * The currently open database or undefined
     */
    database: Database | undefined;

    /**
     * Creates a new db at the given location, opens the database-connection and initializes (create table, metadata, ...)
     * @param url the url to the db-file
     * @param libraryName the name of the library
     */
    public createLibrary(url: string, libraryName: string): Result {
        const result: Result = this.openDatabase(url, true);
        if (result.successful) {
            this.database = result.payload;
            return this.initializeLibrary(libraryName);
        } else {
            return result;
        }
    }

    /**
     * Opens the connection to the database at the given location. If a db is already open, it will be closed first.
     * @param url the url to the db-file
     * @param create whether to create a new file or just open the existing one
     */
    private openDatabase(url: string, create: boolean): Result {
        this.closeDatabase();
        const mode: number = create ? (OPEN_CREATE | OPEN_READWRITE) : OPEN_READWRITE;
        let error: string | undefined = undefined;
        const db = new Database(url, mode, (err: any) => {
            if (err) {
                error = err.message;
            }
        });
        if (error) {
            console.log('Error opening db "' + url + '": ' + error);
            return errorResult([error]);
        } else {
            console.log('Opened db: ' + url);
            return successResult(db);
        }
    }

    /**
     * Closes the current database connection (only if it is open)
     */
    public closeDatabase() {
        if (this.database) {
            this.database.close();
        }
    }

    /**
     * Initializes a newly created database (creates table, insert metadata)
     * @param libraryName the name of the library
     */
    private initializeLibrary(libraryName: string): Result {
        let errors: string[] = [];

        function handlePossibleError(error: any) {
            if (error) {
                errors.push(error);
            }
        }

        const timestamp = Date.now();
        const sqlTableMetadata = 'CREATE TABLE metadata (' +
            '  key TEXT NOT NULL,' +
            '  value TEXT,' +
            '  PRIMARY KEY (key, value)' +
            ')';
        const sqlInsertMetaName = 'INSERT INTO metadata VALUES ("library_name", "' + libraryName + '");';
        const sqlInsertMetaTsCreated = 'INSERT INTO metadata VALUES ("created_timestamp", "' + timestamp + '");';
        const sqlInsertMetaTsOpened = 'INSERT INTO metadata VALUES ("last_opened_timestamp", "' + timestamp + '");';

        this.database.serialize(() => {
            this.database.run(sqlTableMetadata, err => handlePossibleError(err));
            this.database.parallelize(() => {
                this.database.run(sqlInsertMetaName, err => handlePossibleError(err));
                this.database.run(sqlInsertMetaTsCreated, err => handlePossibleError(err));
                this.database.run(sqlInsertMetaTsOpened, err => handlePossibleError(err));
            });
        });
        if (errors.length == 0) {
            console.log('Initialized db.');
            return successResult();
        } else {
            console.log('Error while initializing db: ' + errors.join(';\n'));
            return errorResult(errors);
        }
    }


}
