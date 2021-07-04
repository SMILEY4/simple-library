import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntry} from "../../../common/commonModels";
import {sqlGetItemsWithAttributesByCustomFilter} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";

export interface ModelItemsGetAllBySmartQuery {
    id: number,
    timestamp: number,
    filepath: string,
    sourceFilepath: string,
    hash: string,
    thumbnail: string,
    metadataEntries: MetadataEntry[]
}

export class ItemsGetAllBySmartQuery extends QueryMultiple<ModelItemsGetAllBySmartQuery> {

    constructor(smartQuery: string, itemAttributeKeys: string[]) {
        super(sqlGetItemsWithAttributesByCustomFilter(smartQuery.trim(), itemAttributeKeys));
    }

    convertRow(row: any): ModelItemsGetAllBySmartQuery {
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
