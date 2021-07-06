import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntryType} from "../../../common/commonModels";
import {sqlGetItemMetadata} from "../sql/sql";
import DataAccess from "../dataAccess";


export interface ModelAttributesGetByItemId {
    key: string,
    value: string,
    type: MetadataEntryType,
}

export class AttributesGetByItemIdQuery extends QueryMultiple<ModelAttributesGetByItemId> {

    static run(dataAccess: DataAccess, itemId: number): Promise<ModelAttributesGetByItemId[]> {
        return new AttributesGetByItemIdQuery(itemId).run(dataAccess)
    }

    constructor(itemId: number) {
        super(sqlGetItemMetadata(itemId));
    }

    convertRow(row: any): ModelAttributesGetByItemId {
        return {
            key: row.key,
            value: row.value,
            type: row.type,
        };
    }

}
