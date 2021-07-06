import {Command} from "./base/Command";
import {sqlUpdateCollectionsGroupId, sqlUpdateCollectionSmartQuery, sqlUpdateCollectionsParents} from "../sql/sql";
import DataAccess from "../dataAccess";

export class CollectionUpdateParentGroupCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number, parentGroupId: number | null): Promise<number> {
        return new CollectionUpdateParentGroupCommand(collectionId, parentGroupId).run(dataAccess);
    }

    constructor(collectionId: number, parentGroupId: number | null) {
        super(sqlUpdateCollectionsGroupId(collectionId, parentGroupId));
    }

}
