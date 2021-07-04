import {QueryMultiple} from "./base/QueryMultiple";
import {MetadataEntryType} from "../../../common/commonModels";
import {sqlGetItemMetadata, sqlGetMetadataEntry} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export interface ModelAttributesGetByItemIdAndKey {
    key: string,
    value: string,
    type: MetadataEntryType,
}

export class AttributesGetByItemIdAndKeyQuery extends QuerySingle<ModelAttributesGetByItemIdAndKey> {

    constructor(itemId: number, attributeKey: string) {
        super(sqlGetMetadataEntry(itemId, attributeKey));
    }

    convertRow(row: any): ModelAttributesGetByItemIdAndKey {
        return {
            key: row.key,
            value: row.value,
            type: row.type,
        };
    }

}
