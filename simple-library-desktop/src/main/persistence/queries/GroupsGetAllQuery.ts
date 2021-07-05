import {QueryMultiple} from "./base/QueryMultiple";
import {ItemData, MetadataEntry, MetadataEntryType} from "../../../common/commonModels";
import {sqlAllGroups, sqlGetItemsWithAttributesInCollection} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";


export interface ModelGroupsGetAll {
    id: number,
    name: string,
    parentId: number | null
}

export class GroupsGetAllQuery extends QueryMultiple<ModelGroupsGetAll> {

    constructor() {
        super(sqlAllGroups());
    }

    convertRow(row: any): ModelGroupsGetAll {
        return {
            id: row.group_id,
            name: row.name,
            parentId: row.parent_group_id ? row.parent_group_id : null,
        };
    }

}
