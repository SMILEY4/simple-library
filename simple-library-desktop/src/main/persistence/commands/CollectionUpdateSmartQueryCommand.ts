import {Command} from "./base/Command";
import {sqlUpdateCollectionSmartQuery} from "../sql/sql";

export class CollectionUpdateSmartQueryCommand extends Command {

    constructor(collectionId: number, smartQuery: string) {
        super(sqlUpdateCollectionSmartQuery(collectionId, smartQuery));
    }

}
