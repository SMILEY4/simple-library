import {Command} from "./base/Command";
import {sqlInsertItem} from "../sql/sql";

export interface ModelItemInsert {
    filepath: string,
    timestamp: number,
    hash: string,
    thumbnail: string
}

export class ItemInsertCommand extends Command {

    constructor(entry: ModelItemInsert) {
        super(sqlInsertItem(entry.filepath, entry.timestamp, entry.hash, entry.thumbnail));
    }

}
