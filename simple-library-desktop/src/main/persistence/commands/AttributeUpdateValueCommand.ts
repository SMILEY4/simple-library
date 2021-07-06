import {Command} from "./base/Command";
import {sqlUpdateMetadataEntry} from "../sql/sql";
import DataAccess from "../dataAccess";


export class AttributeUpdateValueCommand extends Command {


    static run(dataAccess: DataAccess, itemId: number, entryKey: string, newValue: string): Promise<number> {
        return new AttributeUpdateValueCommand(itemId, entryKey,newValue).run(dataAccess);
    }

    constructor(itemId: number, entryKey: string, newValue: string) {
        super(sqlUpdateMetadataEntry(itemId, entryKey, newValue));
    }

}
