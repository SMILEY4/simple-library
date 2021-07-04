import {sqlGetMetadataLibraryName, sqlUpdateMetadataTimestampLastOpened} from "../sql/sql";
import DataAccess from "../dataAccess";
import {CommandCustom} from "./base/CommandCustom";


export class LibraryOpenCommand extends CommandCustom<string> {

    url: string

    constructor(url: string) {
        super();
        this.url = url;
    }


    async run(dataAccess: DataAccess): Promise<string> {
        await dataAccess.openDatabase(this.url, false);
        await dataAccess.executeRun(sqlUpdateMetadataTimestampLastOpened(Date.now()));
        return dataAccess.queryAll(sqlGetMetadataLibraryName()).then((row: any[]) => row[0].value);
    }
}
