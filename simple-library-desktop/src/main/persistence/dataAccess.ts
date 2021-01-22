import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import { errorResult, Result, successResult } from '../utils/result';

export default class DataAccess {

    dbUrl: string;


    public createLibrary(url: string, libraryName: string): Result {
        const result: Result = this.connectToDatabase(url, true);
        if (result.successful) {
            return this.initializeLibrary(result.payload, libraryName);
        } else {
            return result;
        }
    }


    private connectToDatabase(url: string, create: boolean): Result {
        const mode: number = create ? OPEN_CREATE | OPEN_READWRITE : OPEN_READWRITE;
        let error: string | undefined = undefined;
        const db = new Database(url, mode, (err: any) => {
            if (err) {
                error = err.message;
            }
        });
        if (error) {
            console.log('Error connecting to db "' + url + '": ' + error);
            return errorResult([error]);
        } else {
            this.dbUrl = url;
            console.log('Connected to db: ' + url);
            return successResult(db);
        }
    }


    private initializeLibrary(db: Database, libraryName: string): Result {
        let error: string | undefined = undefined;
        this.run(db, 'CREATE TABLE metadata (' +
            '  key TEXT NOT NULL,' +
            '  value TEXT,' +
            '  PRIMARY KEY (key, value)' +
            ')')
            .then(() => this.run(db, 'INSERT INTO metadata VALUES ("library_name", "' + libraryName + '");'))
            .then(() => this.run(db, 'INSERT INTO metadata VALUES ("created_timestamp", "' + Date.now() + '");'))
            .catch(err => error = err);
        if (error) {
            console.log('Error while initializing db: ' + error);
            return errorResult([error]);
        } else {
            console.log('Initialized db.');
            return successResult();
        }
    }


    private run(db: Database, sql: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            db.run(sql, err => err ? reject() : resolve());
        });
    }


}
