import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export default class DataAccess {

    public static createLibrary(path: string, name: string): string {
        const fullPath = path + '\\' + this.toDbName(name) + '.db';
        const db = this.openDatabase(fullPath);
        DataAccess.initializeLibrary(db, name);
        return fullPath
    }


    private static toDbName(name: string) {
        // remove whitespaces and everything that is not a character or number
        return name.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '');
    }


    private static openDatabase(url: string): Database {
        return new Database(url, OPEN_CREATE | OPEN_READWRITE, (err: any) => {
            if (err) {
                console.error('Error while creating/connecting to db (' + url + '): ' + err.message);
            }
            console.log('Created and connected to database: ' + url);
        });
    }


    private static initializeLibrary(db: Database, libraryName: string) {
        this.run(db, 'CREATE TABLE metadata (' +
            '  key TEXT NOT NULL,' +
            '  value TEXT,' +
            '  PRIMARY KEY (key, value)' +
            ')')
            .then(() => this.run(db, 'INSERT INTO metadata VALUES ("library_name", "' + libraryName + '");'))
            .then(() => this.run(db, 'INSERT INTO metadata VALUES ("created_timestamp", "' + Date.now() + '");'))
            .catch(err => console.log('Error while initializing library: ' + err));
    }


    private static run(db: Database, sql: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            db.run(sql, err => err ? reject() : resolve());
        });
    }


}
