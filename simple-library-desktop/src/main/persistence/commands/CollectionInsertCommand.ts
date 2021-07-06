import {Command} from "./base/Command";
import {sqlInsertCollection} from "../sql/sql";
import {CollectionType} from "../../../common/commonModels";
import DataAccess from "../dataAccess";

export interface ModelCollectionInsert {
    name: string,
    type: CollectionType,
    smartQuery: string | null,
    groupId: number | null
}

export class CollectionInsertCommand extends Command {

    static run(dataAccess: DataAccess, entry: ModelCollectionInsert): Promise<number> {
        return new CollectionInsertCommand(entry).run(dataAccess);
    }

    constructor(entry: ModelCollectionInsert) {
        super(sqlInsertCollection(
            entry.name,
            entry.type,
            (entry.smartQuery && entry.smartQuery.trim().length > 0) ? entry.smartQuery.trim() : null,
            entry.groupId
        ));
    }

}
