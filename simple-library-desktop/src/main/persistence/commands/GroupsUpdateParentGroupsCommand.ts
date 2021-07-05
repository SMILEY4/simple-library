import {Command} from "./base/Command";
import {sqlUpdateCollectionSmartQuery, sqlUpdateCollectionsParents, sqlUpdateGroupsParents} from "../sql/sql";

export class GroupsUpdateParentGroupsCommand extends Command {

    constructor(prevParentGroupId: number | null, nextParentGroupId: number | null) {
        super(sqlUpdateGroupsParents(prevParentGroupId, nextParentGroupId));
    }

}
