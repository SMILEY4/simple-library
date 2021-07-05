import {Command} from "./base/Command";
import {sqlUpdateCollectionsGroupId, sqlUpdateCollectionSmartQuery, sqlUpdateCollectionsParents} from "../sql/sql";

export class CollectionUpdateParentGroupCommand extends Command {

    constructor(collectionId: number, parentGroupId: number | null) {
        super(sqlUpdateCollectionsGroupId(collectionId, parentGroupId));
    }

}
