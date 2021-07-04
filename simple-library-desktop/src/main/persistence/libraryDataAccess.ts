import DataAccess from './dataAccess';
import {LibraryMetadata} from '../../common/commonModels';
import {sqlAllMetadata,} from './sql/sql';
import {LibraryCreateCommand} from "./commands/LibraryCreateCommand";
import {LibraryOpenCommand} from "./commands/LibraryOpenCommand";
import {LibraryCloseCommand} from "./commands/LibraryCloseCommand";
import {LibraryMetadataQuery} from "./queries/LibraryMetadataQuery";

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
    public createLibrary(url: string, libraryName: string): Promise<void> {
        return new LibraryCreateCommand(url, libraryName).run(this.dataAccess).then();
    }

    /**
     * Opens the library at the given path. Fails if the file does not exist
     * @param url the path to the db-fil
     * @return a promise that resolves with the name of the library
     */
    public openLibrary(url: string): Promise<string> {
        return new LibraryOpenCommand(url).run(this.dataAccess);
    }


    /**
     * Closes the currently open database
     */
    public closeCurrentLibrary(): void {
        new LibraryCloseCommand().run(this.dataAccess).then();
    }


    /**
     * @return a promise that resolves with the metadata of the current library
     */
    public getLibraryMetadata(): Promise<LibraryMetadata> {
        return new LibraryMetadataQuery().run(this.dataAccess);
    }

}
