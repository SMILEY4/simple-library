import {Command} from "./base/Command";
import {sqlUpdateCollectionName} from "../sql/sql";
import DataAccess from "../dataAccess";

export class CollectionUpdateNameCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number, name: string): Promise<number> {
        return new CollectionUpdateNameCommand(collectionId, name).run(dataAccess);
    }

    constructor(collectionId: number, name: string) {
        super(sqlUpdateCollectionName(collectionId, name));
    }

}
