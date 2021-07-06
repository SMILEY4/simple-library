import {Command} from "./base/Command";
import {sqlAddItemsToCollection, sqlInsertCollection, sqlRemoveItemsFromCollection} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";
import DataAccess from "../dataAccess";


export class CollectionDeleteItemsCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number, itemIds: number[]): Promise<number> {
        return new CollectionDeleteItemsCommand(collectionId, itemIds).run(dataAccess);
    }

    constructor(collectionId: number, itemIds: number[]) {
        super(sqlRemoveItemsFromCollection(collectionId, itemIds));
    }

}
