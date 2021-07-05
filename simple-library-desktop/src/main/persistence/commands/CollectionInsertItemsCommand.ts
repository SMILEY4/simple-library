import {Command} from "./base/Command";
import {sqlAddItemsToCollection, sqlInsertCollection} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";


export class CollectionInsertItemsCommand extends Command {

    constructor(collectionId: number, itemIds: number[]) {
        super(sqlAddItemsToCollection(collectionId, itemIds));
    }

}
