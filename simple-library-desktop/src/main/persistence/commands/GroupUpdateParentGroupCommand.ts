import {Command} from "./base/Command";
import {
    sqlUpdateCollectionSmartQuery,
    sqlUpdateCollectionsParents,
    sqlUpdateGroupsParentId,
    sqlUpdateGroupsParents
} from "../sql/sql";

export class GroupUpdateParentGroupCommand extends Command {

    constructor(groupId: number, parentGroupId: number | null) {
        super(sqlUpdateGroupsParentId(groupId, parentGroupId));
    }

}
