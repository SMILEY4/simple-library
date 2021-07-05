import {sqlAddItemsToCollection, sqlRemoveItemsFromCollection} from "../sql/sql";
import {CommandMultiple} from "./base/CommandMultiple";

export class CollectionMoveItemsCommand extends CommandMultiple {

    constructor(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]) {
        super([
            sqlAddItemsToCollection(tgtCollectionId, itemIds),
            sqlRemoveItemsFromCollection(srcCollectionId, itemIds)
        ]);
    }

}
