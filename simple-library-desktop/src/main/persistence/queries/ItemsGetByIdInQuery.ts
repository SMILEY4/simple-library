import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntry} from "../../../common/commonModels";
import {sqlGetItemsWithAttributesByCustomFilter} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";
import DataAccess from "../dataAccess";


export interface ModelItemsGetByIdIn {
    id: number,
    timestamp: number,
    filepath: string,
    sourceFilepath: string,
    hash: string,
    thumbnail: string,
    metadataEntries: MetadataEntry[]
}

export class ItemsGetByIdInQuery extends QueryMultiple<ModelItemsGetByIdIn> {

    static run(dataAccess: DataAccess, itemIds: number[], itemAttributeKeys: string[]): Promise<ModelItemsGetByIdIn[]> {
        return new ItemsGetByIdInQuery(itemIds, itemAttributeKeys).run(dataAccess);
    }

    constructor(itemIds: number[], itemAttributeKeys: string[]) {
        super(sqlGetItemsWithAttributesByCustomFilter("items.item_id IN (" + itemIds.join(",") + ")", itemAttributeKeys));
    }

    convertRow(row: any): ModelItemsGetByIdIn {
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
