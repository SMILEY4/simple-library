import {Command} from "./base/Command";
import {sqlDeleteCollection} from "../sql/sql";
import DataAccess from "../dataAccess";
import {ModelCollectionInsert} from "./CollectionInsertCommand";


export class CollectionDeleteCommand extends Command {

    static run(dataAccess: DataAccess, collectionId: number): Promise<number> {
        return new CollectionDeleteCommand(collectionId).run(dataAccess);
    }

    constructor(collectionId: number) {
        super(sqlDeleteCollection(collectionId));
    }

}
