import {sqlAddItemsToCollection, sqlRemoveItemsFromCollection} from "../sql/sql";
import {CommandMultiple} from "./base/CommandMultiple";
import DataAccess from "../dataAccess";

export class CollectionMoveItemsCommand extends CommandMultiple {

    static run(dataAccess: DataAccess, srcCollectionId: number, tgtCollectionId: number, itemIds: number[]): Promise<void> {
        return new CollectionMoveItemsCommand(srcCollectionId, tgtCollectionId, itemIds).run(dataAccess);
    }

    constructor(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]) {
        super([
            sqlAddItemsToCollection(tgtCollectionId, itemIds),
            sqlRemoveItemsFromCollection(srcCollectionId, itemIds)
        ]);
    }

}
