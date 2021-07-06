import {MetadataEntryType} from "../../../common/commonModels";
import {sqlGetMetadataEntry} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";
import DataAccess from "../dataAccess";


export interface ModelAttributesGetByItemIdAndKey {
    key: string,
    value: string,
    type: MetadataEntryType,
}

export class AttributesGetByItemIdAndKeyQuery extends QuerySingle<ModelAttributesGetByItemIdAndKey> {

    static run(dataAccess: DataAccess, itemId: number, attributeKey: string): Promise<ModelAttributesGetByItemIdAndKey> {
        return new AttributesGetByItemIdAndKeyQuery(itemId, attributeKey).run(dataAccess)
    }

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
