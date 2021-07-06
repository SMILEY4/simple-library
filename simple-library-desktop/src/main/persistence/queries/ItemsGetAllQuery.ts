import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntry} from "../../../common/commonModels";
import {sqlGetItemsWithAttributesInCollection} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";
import DataAccess from "../dataAccess";


export interface ModelItemsGetAll {
    id: number,
    timestamp: number,
    filepath: string,
    sourceFilepath: string,
    hash: string,
    thumbnail: string,
    metadataEntries: MetadataEntry[]
}

export class ItemsGetAllQuery extends QueryMultiple<ModelItemsGetAll> {

    static run(dataAccess: DataAccess, collectionId: number, itemAttributeKeys: string[]): Promise<ModelItemsGetAll[]> {
        return new ItemsGetAllQuery(collectionId, itemAttributeKeys).run(dataAccess);
    }

    constructor(collectionId: number, itemAttributeKeys: string[]) {
        super(sqlGetItemsWithAttributesInCollection(collectionId, itemAttributeKeys));
    }

    convertRow(row: any): ModelItemsGetAll {
        return {
            id: row.item_id,
            timestamp: row.timestamp_imported,
            filepath: row.filepath,
            sourceFilepath: row.filepath,
            hash: row.hash,
            thumbnail: row.thumbnail,
            metadataEntries: concatAttributeColumnToEntries(row.attributes)
        };
    }

}
