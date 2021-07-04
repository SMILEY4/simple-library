import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntryType} from "../../../common/commonModels";
import {sqlGetItemMetadata} from "../sql/sql";


export interface ModelAttributesGetByItemId {
    key: string,
    value: string,
    type: MetadataEntryType,
}

export class AttributesGetByItemIdQuery extends QueryMultiple<ModelAttributesGetByItemId> {

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
