import {Command} from "./base/Command";
import {sqlUpdateCollectionSmartQuery, sqlUpdateCollectionsParents} from "../sql/sql";

export class CollectionsUpdateParentGroupsCommand extends Command {

    constructor(prevParentGroupId: number | null, nextParentGroupId: number | null) {
        super(sqlUpdateCollectionsParents(prevParentGroupId, nextParentGroupId));
    }

}
