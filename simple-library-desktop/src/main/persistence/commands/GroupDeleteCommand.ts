import {Command} from "./base/Command";
import {sqlDeleteGroup} from "../sql/sql";


export class GroupDeleteCommand extends Command {

    constructor(groupId: number) {
        super(sqlDeleteGroup(groupId));
    }

}
