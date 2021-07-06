import {sqlFindGroupById} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";
import DataAccess from "../dataAccess";


export interface ModelGroupsGetById {
    id: number,
    name: string,
    parentId: number | null
}

export class GroupsGetByIdQuery extends QuerySingle<ModelGroupsGetById> {

    static run(dataAccess: DataAccess, groupId: number): Promise<ModelGroupsGetById> {
        return new GroupsGetByIdQuery(groupId).run(dataAccess);
    }

    constructor(groupId: number) {
        super(sqlFindGroupById(groupId));
    }

    convertRow(row: any): ModelGroupsGetById {
        return {
            id: row.group_id,
            name: row.name,
            parentId: row.parent_group_id ? row.parent_group_id : null,
        };
    }

}
