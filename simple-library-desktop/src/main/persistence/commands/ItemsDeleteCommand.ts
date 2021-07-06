import {sqlDeleteItems, sqlRemoveItemsFromAllCollections} from "../sql/sql";
import {CommandMultiple} from "./base/CommandMultiple";
import DataAccess from "../dataAccess";


export class ItemsDeleteCommand extends CommandMultiple {

    static run(dataAccess: DataAccess, itemIds: number[]): Promise<void> {
        return new ItemsDeleteCommand(itemIds).run(dataAccess);
    }

    constructor(itemIds: number[]) {
        super([
            sqlRemoveItemsFromAllCollections(itemIds),
            sqlDeleteItems(itemIds)
        ]);
    }

}
