import DataAccess from './dataAccess';
import {
    sqlAllGroups,
    sqlDeleteGroup,
    sqlFindGroupById,
    sqlInsertGroup,
    sqlUpdateGroupName, sqlUpdateGroupsParentId,
    sqlUpdateGroupsParents,
} from './sql/sql';
import { GroupDTO } from '../../common/commonModels';

export class GroupDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    /**
     * @return a promise that resolves with all {@link GroupDTO}s
     */
    public getGroups(): Promise<GroupDTO[]> {
        return this.dataAccess.queryAll(sqlAllGroups())
            .then((rows: any[]) => rows.map((row: any) => {
                return {
                    id: row.group_id,
                    name: row.name,
                    parentId: row.parent_group_id,
                };
            }));
    }

    /**
     * @param groupId the id of the group to fetch
     * @return a promise that resolves with the found group or null
     */
    public findGroupById(groupId: number): Promise<GroupDTO | null> {
        return this.dataAccess.querySingle(sqlFindGroupById(groupId))
            .then((row: any | undefined) => {
                if (row) {
                    return {
                        id: row.group_id,
                        name: row.name,
                        parentId: row.parent_group_id,
                    };
                } else {
                    return null;
                }
            });
    }


    /**
     * Creates a new group with the given name
     * @param name the name of the new group
     * @param parentGroupId the id of the parent group or null
     * @return  a promise that resolves with the created {@link GroupDTO}
     */
    public createGroup(name: string, parentGroupId: number | null): Promise<GroupDTO> {
        return this.dataAccess.executeRun(sqlInsertGroup(name, parentGroupId ? parentGroupId : null))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    parentId: parentGroupId,
                };
            });
    }


    /**
     * Deletes the given group
     * @param groupId the id of the group
     * @return a promise that resolves when the group was deleted
     */
    public deleteGroup(groupId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteGroup(groupId)).then();
    }


    /**
     * Renames the given group
     * @param groupId the id of the group
     * @param newName the new name of the group
     * @return a promise that resolves when the group was renamed
     */
    public renameGroup(groupId: number, newName: string): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateGroupName(groupId, newName)).then();
    }


    /**
     * Moves all child groups of the given parent group to the new group
     * @param prevParentGroupId the id of the previous parent group or null
     * @param newParentGroupId the id of the new parent group or null
     * @return a promise that resolves when the groups were moved
     */
    public moveGroups(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateGroupsParents(prevParentGroupId, newParentGroupId)).then();
    }

    /**
     * Sets the parent group id of the group with the given id
     * @param groupId the id of the group to update
     * @param parentGroupId the parent group id to set
     * @return a promise that resolves when the id was set
     */
    public setParentGroup(groupId: number, parentGroupId: number | null): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateGroupsParentId(groupId, parentGroupId)).then();
    }

}
