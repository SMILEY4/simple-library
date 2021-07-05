import {Command} from "./base/Command";
import {sqlInsertGroup} from "../sql/sql";


export class GroupInsertCommand extends Command {

    constructor(name: string, parentGroupId: number | null) {
        super(sqlInsertGroup(name, parentGroupId));
    }

}
