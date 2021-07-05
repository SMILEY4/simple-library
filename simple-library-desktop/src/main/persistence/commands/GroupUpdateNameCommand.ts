import {Command} from "./base/Command";
import {sqlUpdateCollectionName, sqlUpdateGroupName} from "../sql/sql";

export class GroupUpdateNameCommand extends Command {

    constructor(groupId: number, name: string) {
        super(sqlUpdateGroupName(groupId, name));
    }

}
