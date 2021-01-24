import DataAccess from './dataAccess';

export interface LibraryMetadata {
    name: string,
    timestampCreated: number,
    timestampLastOpened: number
}

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

    public async getLibraryMetadata(): Promise<LibraryMetadata> {
        const result: any = await this.dataAccess.queryAll('SELECT * FROM metadata;');
        return {
            name: result.find((row: any) => row.key === 'library_name').value,
            timestampCreated: parseInt(result.find((row: any) => row.key === 'timestamp_created').value),
            timestampLastOpened: parseInt(result.find((row: any) => row.key === 'timestamp_last_opened').value),
        };
    }

}