import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export default class DataAccess {

    database: Database | undefined;


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


    public closeDatabase() {
        if (this.database) {
            this.database.close();
            this.database = null;
            console.log("Closed current database")
        }
    }


    public executeRun(sql: string): Promise<void> {
        return this.executeSqlInPromise((resolve, reject) => {
            this.database.run(sql, (err) => err ? reject(err) : resolve());
        });
    }


    public queryAll(sql: string): Promise<any> {
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
