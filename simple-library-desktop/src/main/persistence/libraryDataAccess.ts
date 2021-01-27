import DataAccess from './dataAccess';
import { LibraryMetadata } from '../models/commonModels';

export class LibraryDataAccess {

    dataAccess: DataAccess;

    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public async createLibrary(url: string, libraryName: string): Promise<void> {
        const error: string | undefined = this.dataAccess.openDatabase(url, true);
        if (error) {
            console.log('Failed to create library: ' + url + ' - ' + error);
            return Promise.reject();
        } else {
            console.log('Created library: ' + url);
            const timestamp = Date.now();
            await this.dataAccess.executeRun('CREATE TABLE metadata (' +
                '  key TEXT NOT NULL,' +
                '  value TEXT,' +
                '  PRIMARY KEY (key, value)' +
                ')');
            await Promise.all([
                this.dataAccess.executeRun('INSERT INTO metadata VALUES ("library_name", "' + libraryName + '");'),
                this.dataAccess.executeRun('INSERT INTO metadata VALUES ("timestamp_created", "' + timestamp + '");'),
                this.dataAccess.executeRun('INSERT INTO metadata VALUES ("timestamp_last_opened", "' + timestamp + '");'),
            ]);
        }
    }

    public async openLibrary(url: string): Promise<string> {
        await this.dataAccess.openDatabase(url, false);
        await this.dataAccess.executeRun('UPDATE metadata SET value = "' + Date.now() + '" WHERE key = "timestamp_last_opened";');
        return this.dataAccess.queryAll('SELECT value FROM metadata WHERE key = "library_name";').then((row: any) => row[0].value);
    }

    public async getLibraryMetadata(): Promise<LibraryMetadata> {
        const result: any = await this.dataAccess.queryAll('SELECT * FROM metadata;');
        return {
            name: result.find((row: any) => row.key === 'library_name').value,
            timestampCreated: parseInt(result.find((row: any) => row.key === 'timestamp_created').value),
            timestampLastOpened: parseInt(result.find((row: any) => row.key === 'timestamp_last_opened').value),
        };
    }

}