import {Command} from "./base/Command";
import {sqlDeleteCollection} from "../sql/sql";


export class CollectionDeleteCommand extends Command {

    constructor(collectionId: number) {
        super(sqlDeleteCollection(collectionId));
    }

}
