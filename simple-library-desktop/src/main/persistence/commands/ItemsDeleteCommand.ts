import {sqlDeleteItems, sqlRemoveItemsFromAllCollections} from "../sql/sql";
import {CommandMultiple} from "./base/CommandMultiple";


export class ItemsDeleteCommand extends CommandMultiple {

    constructor(itemIds: number[]) {
        super([
            sqlRemoveItemsFromAllCollections(itemIds),
            sqlDeleteItems(itemIds)
        ]);
    }

}
