import {QueryMerging} from "./base/QueryMerging";
import {sqlAllMetadata} from "../sql/sql";
import DataAccess from "../dataAccess";

export interface ModelLibraryMetadata {
    name: string,
    timestampCreated: number,
    timestampLastOpened: number
}

export class LibraryMetadataQuery extends QueryMerging<ModelLibraryMetadata> {

    static run(dataAccess: DataAccess): Promise<ModelLibraryMetadata> {
        return new LibraryMetadataQuery().run(dataAccess);
    }

    constructor() {
        super(sqlAllMetadata());
    }

    mergeRows(rows: any[]): ModelLibraryMetadata {
        return {
            name: rows.find((row: any) => row.key === 'library_name').value,
            timestampCreated: parseInt(rows.find((row: any) => row.key === 'timestamp_created').value),
            timestampLastOpened: parseInt(rows.find((row: any) => row.key === 'timestamp_last_opened').value),
        };
    }

}
