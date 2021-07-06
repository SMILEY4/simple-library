import {sqlGetMetadataLibraryName, sqlUpdateMetadataTimestampLastOpened} from "../sql/sql";
import DataAccess from "../dataAccess";
import {CommandCustom} from "./base/CommandCustom";


export class LibraryOpenCommand extends CommandCustom<string> {

    url: string

    constructor(url: string) {
        super();
        this.url = url;
    }

    run(dataAccess: DataAccess): Promise<string> {
        return dataAccess.openDatabase(this.url, false)
            .then(() => dataAccess.executeRun(sqlUpdateMetadataTimestampLastOpened(Date.now())))
            .then(() => dataAccess.queryAll(sqlGetMetadataLibraryName()))
            .then((row: any[]) => row[0].value)
    }
}
