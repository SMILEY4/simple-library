import DataAccess from './dataAccess';
import {sqlDeleteGroup, sqlUpdateGroupName, sqlUpdateGroupsParentId, sqlUpdateGroupsParents,} from './sql/sql';
import {GroupDTO} from '../../common/commonModels';
import {GroupsGetAllQuery} from "./queries/GroupsGetAllQuery";
import {GroupsGetByIdQuery} from "./queries/GroupsGetByIdQuery";
import {GroupInsertCommand} from "./commands/GroupInsertCommand";
import {GroupDeleteCommand} from "./commands/GroupDeleteCommand";
import {GroupUpdateNameCommand} from "./commands/GroupUpdateNameCommand";
import {GroupsUpdateParentGroupsCommand} from "./commands/GroupsUpdateParentGroupsCommand";
import {GroupUpdateParentGroupCommand} from "./commands/GroupUpdateParentGroupCommand";

export class GroupDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    /**
     * @return a promise that resolves with all {@link GroupDTO}s
     */
    public getGroups(): Promise<GroupDTO[]> {
        return new GroupsGetAllQuery().run(this.dataAccess)
    }

    /**
     * @param groupId the id of the group to fetch
     * @return a promise that resolves with the found group or null
     */
    public findGroupById(groupId: number): Promise<GroupDTO | null> {
        return new GroupsGetByIdQuery(groupId).run(this.dataAccess);
    }


    /**
     * Creates a new group with the given name
     * @param name the name of the new group
     * @param parentGroupId the id of the parent group or null
     * @return  a promise that resolves with the created {@link GroupDTO}
     */
    public createGroup(name: string, parentGroupId: number | null): Promise<GroupDTO> {
        return new GroupInsertCommand(name, parentGroupId)
            .run(this.dataAccess)
            .then(groupId => this.findGroupById(groupId))
    }


    /**
     * Deletes the given group
     * @param groupId the id of the group
     * @return a promise that resolves when the group was deleted
     */
    public deleteGroup(groupId: number): Promise<void> {
        return new GroupDeleteCommand(groupId).run(this.dataAccess).then();
    }


    /**
     * Renames the given group
     * @param groupId the id of the group
     * @param newName the new name of the group
     * @return a promise that resolves when the group was renamed
     */
    public renameGroup(groupId: number, newName: string): Promise<void> {
        return new GroupUpdateNameCommand(groupId, newName).run(this.dataAccess).then();
    }


    /**
     * Moves all child groups of the given parent group to the new group
     * @param prevParentGroupId the id of the previous parent group or null
     * @param newParentGroupId the id of the new parent group or null
     * @return a promise that resolves when the groups were moved
     */
    public moveGroups(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
        return new GroupsUpdateParentGroupsCommand(prevParentGroupId, newParentGroupId).run(this.dataAccess).then();
    }

    /**
     * Sets the parent group id of the group with the given id
     * @param groupId the id of the group to update
     * @param parentGroupId the parent group id to set
     * @return a promise that resolves when the id was set
     */
    public setParentGroup(groupId: number, parentGroupId: number | null): Promise<void> {
        return new GroupUpdateParentGroupCommand(groupId, parentGroupId).run(this.dataAccess).then();
    }

}
