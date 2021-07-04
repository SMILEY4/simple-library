import {Command} from "./base/Command";
import {sqlUpdateMetadataEntry} from "../sql/sql";


export class AttributeUpdateValueCommand extends Command {

    constructor(itemId: number, entryKey: string, newValue: string) {
        super(sqlUpdateMetadataEntry(itemId, entryKey, newValue));
    }

}
