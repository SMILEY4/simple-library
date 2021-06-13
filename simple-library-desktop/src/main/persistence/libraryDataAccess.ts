import DataAccess from './dataAccess';
import {CollectionType, LibraryMetadata} from '../../common/commonModels';
import {
    sqlAllMetadata,
    sqlCreateTableCollectionItems,
    sqlCreateTableCollections,
    sqlCreateTableGroups,
    sqlCreateTableItems,
    sqlCreateTableMetadata,
    sqlGetMetadataLibraryName,
    sqlInsertCollection,
    sqlInsertMetadataLibraryName,
    sqlInsertMetadataTimestampCreated,
    sqlInsertMetadataTimestampLastOpened,
    sqlUpdateMetadataTimestampLastOpened,
} from './sql/sql';

export class LibraryDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    /**
     * Creates/Initializes the database
     * @param url the url to the db-file. A new one will be created if the file does not exist
     * @param libraryName the name of the library
     * @return a promise that resolves when the library was created and initialized
     */
    public async createLibrary(url: string, libraryName: string): Promise<void> {
        return this.dataAccess.openDatabase(url, true)
            .then(async () => {
                console.log('Created library: ' + url);
                const timestamp = Date.now();
                await this.dataAccess.executeRun(sqlCreateTableMetadata());
                await this.dataAccess.executeRun(sqlCreateTableItems());
                await this.dataAccess.executeRun(sqlCreateTableCollections());
                await this.dataAccess.executeRun(sqlCreateTableCollectionItems());
                await this.dataAccess.executeRun(sqlCreateTableGroups());
                await this.dataAccess.executeRun(sqlInsertMetadataLibraryName(libraryName));
                await this.dataAccess.executeRun(sqlInsertMetadataTimestampCreated(timestamp));
                await this.dataAccess.executeRun(sqlInsertMetadataTimestampLastOpened(timestamp));
                await this.dataAccess.executeRun(sqlInsertCollection("All Items", CollectionType.SMART, "", null))
            })
            .catch(error => {
                console.log('Failed to create library: ' + url + ' - ' + error);
                return Promise.reject();
            })
    }

    /**
     * Opens the library at the given path. Fails if the file does not exist
     * @param url the path to the db-fil
     * @return a promise that resolves with the name of the library
     */
    public async openLibrary(url: string): Promise<string> {
        await this.dataAccess.openDatabase(url, false);
        await this.dataAccess.executeRun(sqlUpdateMetadataTimestampLastOpened(Date.now()));
        return this.dataAccess.queryAll(sqlGetMetadataLibraryName()).then((row: any[]) => row[0].value);
    }


    /**
     * Closes the currently open database
     */
    public closeCurrentLibrary(): void {
        this.dataAccess.closeDatabase();
    }


    /**
     * @return a promise that resolves with the metadata of the current library
     */
    public async getLibraryMetadata(): Promise<LibraryMetadata> {
        const result: any[] = await this.dataAccess.queryAll(sqlAllMetadata());
        return {
            name: result.find((row: any) => row.key === 'library_name').value,
            timestampCreated: parseInt(result.find((row: any) => row.key === 'timestamp_created').value),
            timestampLastOpened: parseInt(result.find((row: any) => row.key === 'timestamp_last_opened').value),
        };
    }

}
