import {QueryMultiple} from "./base/QueryMultiple";
import {ItemData, MetadataEntry, MetadataEntryType} from "../../../common/commonModels";
import {sqlAllGroups, sqlGetItemsWithAttributesInCollection} from "../sql/sql";
import {concatAttributeColumnToEntries} from "./queryUtils";
import DataAccess from "../dataAccess";
import {ModelCollectionsGetAll} from "./CollectionsGetAllQuery";


export interface ModelGroupsGetAll {
    id: number,
    name: string,
    parentId: number | null
}

export class GroupsGetAllQuery extends QueryMultiple<ModelGroupsGetAll> {

    static run(dataAccess: DataAccess): Promise<ModelGroupsGetAll[]> {
        return new GroupsGetAllQuery().run(dataAccess)
    }

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
