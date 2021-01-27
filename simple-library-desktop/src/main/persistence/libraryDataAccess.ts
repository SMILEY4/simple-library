import DataAccess from './dataAccess';
import { LibraryMetadata } from '../models/commonModels';
import {
    sqlCreateTableMetadata,
    sqlGetGetAllMetadata,
    sqlGetMetadataLibraryName,
    sqlInsertMetadataLibraryName,
    sqlInsertMetadataTimestampCreated,
    sqlInsertMetadataTimestampLastOpened,
    sqlUpdateMetadataTimestampLastOpened,
} from './sql';

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
            await this.dataAccess.executeRun(sqlCreateTableMetadata());
            await Promise.all([
                this.dataAccess.executeRun(sqlInsertMetadataLibraryName(libraryName)),
                this.dataAccess.executeRun(sqlInsertMetadataTimestampCreated(timestamp)),
                this.dataAccess.executeRun(sqlInsertMetadataTimestampLastOpened(timestamp)),
            ]);
        }
    }


    public async openLibrary(url: string): Promise<string> {
        await this.dataAccess.openDatabase(url, false);
        await this.dataAccess.executeRun(sqlUpdateMetadataTimestampLastOpened(Date.now()));
        return this.dataAccess.queryAll(sqlGetMetadataLibraryName()).then((row: any) => row[0].value);
    }


    public closeCurrentLibrary(): void {
        this.dataAccess.closeDatabase();
    }


    public async getLibraryMetadata(): Promise<LibraryMetadata> {
        const result: any = await this.dataAccess.queryAll(sqlGetGetAllMetadata());
        return {
            name: result.find((row: any) => row.key === 'library_name').value,
            timestampCreated: parseInt(result.find((row: any) => row.key === 'timestamp_created').value),
            timestampLastOpened: parseInt(result.find((row: any) => row.key === 'timestamp_last_opened').value),
        };
    }

}