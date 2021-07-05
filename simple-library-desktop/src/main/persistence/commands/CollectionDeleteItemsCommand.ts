import {Command} from "./base/Command";
import {sqlAddItemsToCollection, sqlInsertCollection, sqlRemoveItemsFromCollection} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";


export class CollectionDeleteItemsCommand extends Command {

    constructor(collectionId: number, itemIds: number[]) {
        super(sqlRemoveItemsFromCollection(collectionId, itemIds));
    }

}
