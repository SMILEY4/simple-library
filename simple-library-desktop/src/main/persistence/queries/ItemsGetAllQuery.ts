import {QueryMultiple} from "./base/QueryMultiple";
import {ItemData, MetadataEntry, MetadataEntryType} from "../../../common/commonModels";
import {sqlGetItemsWithAttributesInCollection} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";


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
