import {
    sqlCreateTableCollectionItems,
    sqlCreateTableCollections,
    sqlCreateTableGroups,
    sqlCreateTableItemAttributes,
    sqlCreateTableItems,
    sqlCreateTableMetadata,
    sqlInsertCollection,
    sqlInsertMetadataLibraryName,
    sqlInsertMetadataTimestampCreated,
    sqlInsertMetadataTimestampLastOpened
} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";
import DataAccess from "../dataAccess";
import {CommandCustom} from "./base/CommandCustom";


export class LibraryCreateCommand extends CommandCustom<void> {

    url: string;
    libraryName: string;

    constructor(url: string, libraryName: string) {
        super();
        this.url = url;
        this.libraryName = libraryName;
    }


    run(dataAccess: DataAccess): Promise<void> {
        return dataAccess.openDatabase(this.url, true)
            .then(async () => {
                console.log('Created library: ' + this.url);
                const timestamp = Date.now();
                await dataAccess.executeRun(sqlInsertMetadataLibraryName(this.libraryName));
                await dataAccess.executeRun(sqlInsertMetadataTimestampCreated(timestamp));
                await dataAccess.executeRun(sqlInsertMetadataTimestampLastOpened(timestamp));
                await dataAccess.executeRun(sqlCreateTableMetadata());
                await dataAccess.executeRun(sqlCreateTableItems());
                await dataAccess.executeRun(sqlCreateTableItemAttributes());
                await dataAccess.executeRun(sqlCreateTableCollections());
                await dataAccess.executeRun(sqlCreateTableCollectionItems());
                await dataAccess.executeRun(sqlCreateTableGroups());
                await dataAccess.executeRun(sqlInsertCollection("All Items", CollectionType.SMART, "", null))
            })
            .catch(error => {
                console.log('Failed to create library: ' + this.url + ' - ' + error);
                return Promise.reject();
            })
    }
}
