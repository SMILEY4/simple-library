import {Command} from "./base/Command";
import {sqlUpdateCollectionName} from "../sql/sql";

export class CollectionUpdateNameCommand extends Command {

    constructor(collectionId: number, name: string) {
        super(sqlUpdateCollectionName(collectionId, name));
    }

}
