import {Command} from "./base/Command";
import {sqlAddItemsToCollection, sqlInsertCollection} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";
import DataAccess from "../dataAccess";


export class CollectionInsertItemsCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number, itemIds: number[]): Promise<number> {
        return new CollectionInsertItemsCommand(collectionId, itemIds).run(dataAccess);
    }

    constructor(collectionId: number, itemIds: number[]) {
        super(sqlAddItemsToCollection(collectionId, itemIds));
    }

}
