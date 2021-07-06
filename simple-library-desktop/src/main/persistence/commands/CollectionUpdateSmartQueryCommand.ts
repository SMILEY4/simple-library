import {Command} from "./base/Command";
import {sqlUpdateCollectionSmartQuery} from "../sql/sql";
import DataAccess from "../dataAccess";

export class CollectionUpdateSmartQueryCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number, smartQuery: string): Promise<number> {
        return new CollectionUpdateSmartQueryCommand(collectionId, smartQuery).run(dataAccess);
    }

    constructor(collectionId: number, smartQuery: string) {
        super(sqlUpdateCollectionSmartQuery(collectionId, smartQuery));
    }

}
